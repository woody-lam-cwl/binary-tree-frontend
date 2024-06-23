import './App.css';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { AppBar, Box, Button } from '@mui/material';
import CaseAnalysis from './CaseAnalysis';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import DecisionTreeTab from './DecisionTreeTab';

function App() {
  return (
    <BrowserRouter>
      <Box>
        <AppBar
            sx={{height: "3em", display: "flex", flexDirection: "row"}}>
          <ManageSearchIcon sx={{margin: "0.5em 1em"}}/>
          <Button sx={{margin: "0em 1em", color: "#FFFFFF"}} href='\analyse'>Analyse</Button>
          <Button sx={{margin: "0em 1em", color: "#FFFFFF"}} href='\decision-tree'>Browse Decision Trees</Button>
        </AppBar>
        <Box sx={{padding: "4em 1em 1em 2em"}}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="analyse" replace/>}
            />
            <Route
              path="/analyse"
              element={<CaseAnalysis/>}
            />
            <Route
              path="/decision-tree"
              element={<DecisionTreeTab/>}
            />
            <Route
              path="*"
              element={<p>Page not found.</p>}
            />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
