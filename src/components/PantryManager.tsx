import React, { useState, useEffect } from "react";
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import PantryForm from "./PantryForm";
import { DataGrid, GridColDef, GridRowModesModel, GridRowModes, GridRenderCellParams, GridEventListener } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tab } from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useAuth } from "@/src/context/AuthContext";
import useDebounce from "@/src/hooks/useDebounce";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


interface PantryItem {
  id?: string;
  name: string;
  quantity: number;
}


const PantryManager: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState("1");

  const fetchItems = async () => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/pantry`));
      const querySnapshot = await getDocs(q);
      const itemsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PantryItem[];
      setItems(itemsList);
      setFilteredItems(itemsList);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [debouncedSearchQuery, items]);

  const handleDelete = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, `users/${user.uid}/pantry`, id));
      setConfirmDelete(false);
      setDeleteItemId(null);
      fetchItems();
    }
  };

  const handleRowEditStart: GridEventListener<"rowEditStart"> = (params, event) => {
    event.defaultMuiPrevented = true;
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [params.id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    event.defaultMuiPrevented = true;
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [params.id]: { mode: GridRowModes.View },
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue + "");
  };

  const processRowUpdate = async (newRow: PantryItem) => {
    if (user) {
      const itemRef = doc(db, `users/${user.uid}/pantry`, newRow.id!);
      await updateDoc(itemRef, {
        name: newRow.name,
        quantity: newRow.quantity,
      });
      fetchItems();
    }
    return newRow;
  };

  
  // Ensure you import jsPDF and autoTable
  
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
  
    // Extract data from the filteredItems or items
    const tableData = filteredItems.map(item => [item.name, item.quantity]);
  
    // Add table to PDF
    (doc as any).autoTable({
        head: [['Item Name', 'Quantity']],
        body: tableData,
        margin: { top: 10 },
        styles: { fontSize: 10 },
      });
      
  
    // Save the PDF
    doc.save('inventory.pdf');
  };


  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Item Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      flex: 1,
      align: "center",
      editable: true,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      editable: false,
      align: "center",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <>
        
        <Dialog
      open={confirmDelete && deleteItemId === params.row.id}
      sx={{
        '& .MuiPaper-root': {
            backgroundColor:"black",
          border: '2px solid #ed6c03', // Dialog border color
        },
      }}
    >
      <DialogTitle sx={{ color: '#fff' }}>Are you sure you want to delete this item?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#fff' }}>This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setConfirmDelete(false)}
          sx={{
            color: '#ed6c03', // Cancel button text color
            '&:hover': {
              backgroundColor: '#ed6c03', // Cancel button hover color
              color: '#fff', // Cancel button text color on hover
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete(params.row.id)}
          sx={{
            color: '#ed6c03', // Delete button text color
            '&:hover': {
              backgroundColor: '#ed6c03', // Delete button hover color
              color: '#fff', // Delete button text color on hover
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
          <IconButton
          sx={{ color: '#ed6c03' }}
            onClick={() => {
              setRowModesModel((prevModel) => ({
                ...prevModel,
                [params.id]: { mode: GridRowModes.Edit },
              }));
            }}
          >
            <Edit />
          </IconButton>
          <IconButton  sx={{ color: '#ed6c03' }} onClick={() => { setConfirmDelete(true); setDeleteItemId(params.row.id); }}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
    

    <Box margin={6}><PantryForm
            className="flex justify-center items-center gap-x-7"
            refreshItems={fetchItems}
            setSearchQuery={setSearchQuery}
          /></Box>
      
      <div style={{ height: 400, width: '100%' }}>
      <Box>
        <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadPdf}
        sx={{
          marginBottom: 2,
          backgroundColor: '#ed6c03', // Button color
          '&:hover': {
            backgroundColor: '#d35c02', // Button hover color
          },
        }}
      >
        Download PDF
      </Button>
      </Box>
      <DataGrid
        rows={filteredItems}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onRowDoubleClick={(p, e) => { e.stopPropagation(); }}
        sx={{
          borderColor: '#ed6c03', // Border color
          borderWidth: 1, // Border width
          borderStyle: 'solid', // Border style
          backgroundColor: 'black', // Table background color
          '& .MuiDataGrid-cell': {
            color: '#fff', // Cell text color
            borderBottom: '1px solid #fff', // Cell bottom border color
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1f1f1f', // Header background color
            borderBottom: '1px solid #fff', // Header bottom border color
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'black', // Header text color
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #ed6c03', // Footer border color
            backgroundColor: '#ed6c03', // Footer background color
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid #ed6c03', // Row bottom border color
            '&:hover': {
              backgroundColor: '#2a2a2a', // Row hover color
            },
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#333333', // Selected row background color
            '&:hover': {
              backgroundColor: '#3a3a3a', // Selected row hover color
            },
          },
          '& .MuiDataGrid-cellCheckbox': {
            color: '#ed6c03', // Checkbox color
          },
          '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
            color: '#ed6c03', // Checkbox header color
          },
          '& .MuiDataGrid-toolbarContainer': {
            backgroundColor: '#1f1f1f', // Toolbar background color
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#ed6c03', // Field name background color
          },
        }}
      />
    </div>
    </>
  );
};

export default PantryManager;
