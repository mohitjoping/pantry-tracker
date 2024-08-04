import React, { useState, ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface PantrySearchProps {
    onSearch: (query: string) => void;
    className?: string;
}

const PantrySearch: React.FC<PantrySearchProps> = ({ onSearch, className }) => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <TextField
            label="Search Grocery Items"
            value={query}
            onChange={handleSearch}
            fullWidth
            className={className}
            sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ed6c03',
                    margin: {right: 10},  
                    width: '100%',
                      
                  },
                  '&:hover fieldset': {
                    borderColor: '#ed6c03',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ed6c03',
                  },
                  '& input': {
                    color: '#ed6c03', // Text color
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#ed6c03',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ed6c03',    
                },
              }}
        />
    );
};

export default PantrySearch;