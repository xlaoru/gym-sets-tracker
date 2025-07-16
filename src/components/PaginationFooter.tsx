import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { moveToPage, selectPage, selectPages } from "../store/ProgramSlice";

import { IPaginationFooterProps } from "../utils/models";

export default function PaginationFooter({
    isLoading,
}: IPaginationFooterProps) {
    const pages = useSelector(selectPages);
    const page = useSelector(selectPage);

    const dispatch = useDispatch();

    function handleChange(event: React.ChangeEvent<unknown>, value: number) {
        event.preventDefault();
        dispatch(moveToPage(value));
    }

    return (
        <>
            <Pagination
                count={pages}
                page={page}
                onChange={handleChange}
                disabled={isLoading}
            />
        </>
    );
}
