import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";

const AiName = () => {
  const [assistantName, setAssistantName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const selection = location.state as {
    selectedKey: string;
    uploadedFile: File | null;
    imageUrl: string | undefined;
  };

  const handleClick = async () => {
    if (!assistantName.trim()) {
    alert("Please enter an assistant name");
    return;
  }

  if (!selection?.imageUrl && !selection?.uploadedFile) {
    alert("Please select an image for your assistant");
    return;
  }
  
    try {
      setIsLoading(true);
      const url = import.meta.env.VITE_BACKEND_URL;
      const endpoints = `${url}/api/v1/users/updateAssistant`;

      if (selection?.selectedKey === "input" && selection?.uploadedFile) {
        // ab upload ka logic form data ke through nhi to base64 me convert krke
        const fd = new FormData();
        fd.append("assistantName", assistantName);
        fd.append("assistantImage", selection.uploadedFile);
        const result1 = await axios.post(endpoints, fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(result1.data);
      } else {
        const result2 = await axios.post(
          endpoints,
          {
            assistantName,
            imageUrl: selection?.imageUrl,
          },
          { withCredentials: true }
        );
        console.log(result2.data);
      }
      setIsLoading(false);
      navigate("/ai");
    } catch (error) {
      console.log(error);
      alert("Error occurred while creating assistant");
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen items-center">
      <h1 className="text-3xl text-yellow-200 font-bold mb-14">
        Your Assistant Name
      </h1>
      <Input
        className="text-white w-full border-2 max-w-md h-[3rem]"
        placeholder="eg. Lambo"
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName.length > 0 && (
        <Button
          className="mt-12 hover:bg-cyan-200 cursor-pointer rounded-full bg-white text-black text-md h-[3rem] w-fit"
          onClick={handleClick} disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create Your Assistant"}
        </Button>
      )}
    </div>
  );
};

export default AiName;
