import React, { useState, ChangeEvent, FormEvent, ReactElement } from "react";
import { TextField, Button, Box } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "@/src/context/AuthContext";
import PantrySearch from "./PantrySearch";
import Link from "next/link";

interface PantryItem {
  id?: string;
  name: string;
  quantity: number;
}

interface PantryFormProps {
  className?: string;
  children?: ReactElement | null;
  refreshItems: () => void;
  setSearchQuery: (query: string) => void; // New prop for setting the search query
}

const PantryForm: React.FC<PantryFormProps> = ({
  className,
  children,
  refreshItems,
  setSearchQuery, // Accept the new prop
}) => {
  const [item, setItem] = useState<PantryItem>({ name: "", quantity: 0 });
  const { user } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    if (user) {
      e.preventDefault();
      await addDoc(collection(db, `users/${user.uid}/pantry`), item);
      setItem({ name: "", quantity: 0 });
      refreshItems();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={className + " flex-wrap gap-8"}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box>
            <TextField
              label="Item Name"
              name="name"
              value={item.name}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ed6c03",
                    margin: { right: 10 },
                    width: { xs: "45vw", sm: "13vw" },
                    marginBottom: { xs: 1, sm: 0 },
                  },
                  "&:hover fieldset": {
                    borderColor: "#ed6c03",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ed6c03",
                  },
                  "& input": {
                    color: "#ed6c03",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#ed6c03",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ed6c03",
                },
              }}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={item.quantity}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ed6c03",
                    margin: { right: 10 },
                    width: { xs: "45vw", sm: "13vw" },
                    marginBottom: { xs: 1, sm: 0 },
                  },
                  "&:hover fieldset": {
                    borderColor: "#ed6c03",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ed6c03",
                  },
                  "& input": {
                    color: "#ed6c03",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#ed6c03",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ed6c03",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="warning"
              sx={{ margin: 1 }}
            >
              Add Item
            </Button>
            <Link href="../NextPage" passHref>
  <Button
    type="button" // Use "button" for client-side navigation
    variant="contained"
    color="warning"
    sx={{ margin: 1 }}
  >
    Camera
  </Button>
</Link>
          </Box>
          <Box width={{ xs: "80vw", sm: "30vw" }}>
            <PantrySearch onSearch={setSearchQuery} />
          </Box>
        </Box>

        {children}
      </form>
    </>
  );
};

export default PantryForm;
