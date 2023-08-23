import { FormControl, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Key } from "@mui/icons-material";

export const TableData = ({tableHeaders , tableData}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {tableHeaders.map((item, index) => (
                            <TableCell key={index} align="center">{item}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData?.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell align="center">{row.title}</TableCell>
                            <TableCell align="center">{row.description}</TableCell>
                            <TableCell align="center">{row.category.name}</TableCell>
                            <TableCell align="center">{row.user?.username}</TableCell>
                            <TableCell align="center">
                                {new Date(row.createdAt).toLocaleDateString("fa-IR")}
                            </TableCell>
                            <TableCell align="center">{row.version}</TableCell>
                            <TableCell align="center">مشاهده</TableCell>
                            <TableCell align="center">
                                <a
                                    rel="noreferrer"
                                    href={"http://localhost:3000/uploads/" + row.file}
                                    target="_blank"
                                >
                                    فایل
                                </a>
                            </TableCell>
                            <TableCell align="center">
                                <IconButton
                                    color="primary"
                                    size="small"
                                // onClick={() => setEdit(row.id)}
                                >
                                    <ModeEditOutlineIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}