import { List, ListItemButton, ListItemText, Menu, MenuItem } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { DecisionTreeEntry } from "./decision_tree";
import { getAllTrees } from "./backend";

const TreeSelectionDropDown: FunctionComponent<{
    setSelectedTree: (tree: DecisionTreeEntry) => void}> = (props) => {
    const [allTrees, setAllTrees] = useState<DecisionTreeEntry[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        getAllTrees().then(entries => setAllTrees(entries))
    }, []);

    useEffect(() => {
        if (selectedIndex < allTrees.length) {
            props.setSelectedTree(allTrees[selectedIndex]);
        }
    }, [selectedIndex, allTrees]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuItemClick = (
      _: React.MouseEvent<HTMLElement>,
      index: number,
    ) => {
      setSelectedIndex(index);
      setAnchorEl(null);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div>
            <List
            component="nav"
            sx={{ bgcolor: 'background.paper' }}
            >
            <ListItemButton
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickListItem}
            >
                <ListItemText
                primary={allTrees[selectedIndex]?.treeDisplayName}
                />
            </ListItemButton>
            </List>
            <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
            }}
            >
            {allTrees.map((option, index) => (
                <MenuItem
                key={option.treeId}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
                >
                {option.treeDisplayName}
                </MenuItem>
            ))}
            </Menu>
        </div>);
}

export default TreeSelectionDropDown;