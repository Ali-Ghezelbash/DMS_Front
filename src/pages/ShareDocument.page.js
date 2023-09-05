import {
    Button,
    Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tokenManager } from "utils";

export default function ShareDocumentPage() {
    let { token } = useParams();
    const [filename, setFilename] = useState(tokenManager.getDocumentFilename(token))
    const navigate = useNavigate();

    console.log("filename --- ", filename)
    // const handleDownload = () => {
    //     const filenameDoc = tokenManager.getDocumentFilename(token)
    //     console.log(filenameDoc)
    //     setFilename(filenameDoc)
    //     navigate("http://localhost:3000/uploads/" + filename);
    // } 

    return (
        <Stack gap={2}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ backgroundColor: "#f5f5f5", p: 2 }}
            >
                <a href={"http://localhost:3000/uploads/" + tokenManager.getDocumentFilename(token)}>
                <Button
                    variant="outlined"
                    sx={{ width: 120, padding: 1, margin: 2 }}
                >
                    دانلود فایل
                </Button>
                </a>
            </Stack>
        </Stack>
    );
}
