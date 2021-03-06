import { IconButton, ListItemText } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useSelector } from "react-redux";
import { ItemSkeleton } from '../../shared/components/ItemSkeleton';
import { StyledListItem } from "../../shared/components/StyledListItem";
import { StyledListItemSecondaryAction } from "../../shared/components/StyledListItemSecondaryAction";
import { useDeleteItemMutation } from "./listApi";
import { selectCurrentList } from "./listsSlice";

/**
 * Will show a skeleton if item.isSkeleton is true
 */
export const Item = ({ setEditingItem, item }) => {
    const { id, title, notes, isSkeleton } = item
    const [deleteItem] = useDeleteItemMutation()
    const currentListId = useSelector(selectCurrentList)?.id

    if (isSkeleton) {
        return <StyledListItem>
            <ItemSkeleton />
        </StyledListItem>
    }

    return <StyledListItem
        button
        onClick={() => setEditingItem(item)}
        $reserveSpace={true}>
        <ListItemText
            primary={title}
            secondary={notes}
            secondaryTypographyProps={{ noWrap: true }} />
        <StyledListItemSecondaryAction>
            <IconButton
                edge={'end'}
                onClick={e => {
                    e.stopPropagation();
                    deleteItem({ list: currentListId, id })
                }}>
                <DeleteIcon />
            </IconButton>
        </StyledListItemSecondaryAction>

    </StyledListItem>;
}