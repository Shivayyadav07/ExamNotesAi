import axios from "axios"
import {serverUrl} from "../App"
import { setUserData } from "../redux/userSlice";


export const getCurrentUser = async(dispatch)=>{
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser" ,
        { withCredentials: true})
        
        dispatch(setUserData(result.data))
        
    } catch (error) {
        console.log(error);
        
        
    }
}

export const generateNotes = async(payload)=>{
    try {
        const result = await axios.post(serverUrl + "/api/notes/generate-notes",payload,
            {withCredentials:true}
        )
        console.log(result.data);
        return result.data
        
    } catch (error) {
         
    console.log(error);
    console.log("MESSAGE:", error.message);
     
    throw error;
 
 
    }

}

export const downloadPDF = async ({ result }) => {
    try {
        console.log("PDF RESULT:", result);

        const response = await axios.post(
            serverUrl + "/api/pdf/generate-pdf",
            { result },
            {
                responseType: "blob",
                withCredentials: true
            }
        );

        console.log("PDF RESPONSE:", response);
        console.log("STATUS:", response.status);

        const blob = new Blob([response.data], {
            type: "application/pdf"
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "ExamNotesAI.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.log("PDF ERROR:", error);
        console.log("MESSAGE:", error.message);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);

        throw error;
    }
};