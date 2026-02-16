import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef } from "react";
import { UploadCloudIcon } from "lucide-react";
import { FileIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function PeopleImageUpload({
    imageFile, 
    setImageFile, 
    imageLoadingState,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    isEditMode,
    isCustomStyling = false,
}){
    const inputRef = useRef(null);
    
    function handleImageFileChange(event){
        console.log("Selected file:", event.target.files?.[0]);
        const selectedFile = event.target.files?.[0];
        if(selectedFile) setImageFile(selectedFile);
    }
    
    function handleDragOver(event){
        event.preventDefault()
    }
    
    function handleDrop(event){
        event.preventDefault()
        const droppedFile = event.dataTransfer.files?.[0];
        if(droppedFile) setImageFile(droppedFile);
    }
    
    function handleRemoveImage(){
        setImageFile(null);
        setUploadedImageUrl("");
        if(inputRef.current){
            inputRef.current.value = '';
        }
    }
    
    async function uploadImageToCloudinary(){
        setImageLoadingState(true);
        const data = new FormData();
        // IMPORTANT: The field name must match what the backend expects
        // Your Django backend expects 'image' not 'my_file'
        data.append('image', imageFile);
        
        try {
            // Get the auth token from localStorage
            const token = localStorage.getItem('accessToken');
            
            const response = await axios.post('/api/people/upload-image/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            
            console.log("Upload response:", response.data);
            
            if(response?.data?.url){
                setUploadedImageUrl(response.data.url);
                setImageLoadingState(false);
            } else {
                console.error("Unexpected response format:", response.data);
                setImageLoadingState(false);
            }
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
            setImageLoadingState(false);
            // You might want to show a toast here
        }
    }
    
    useEffect(() => {
        if(imageFile !== null) {
            uploadImageToCloudinary();
        }
    }, [imageFile]);
    
    return (
        <div className={`w-full mt-4 ${isCustomStyling ? '':'max-w-md mx-auto'}`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label> 
            <div 
                onDragOver={handleDragOver} 
                onDrop={handleDrop} 
                className={`${isEditMode ? 'opacity-60' : ''} border-2 border-dashed rounded-lg p-4`}
            >
                <Input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    ref={inputRef} 
                    onChange={handleImageFileChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                />
                {
                    !imageFile ? (
                        <Label 
                            htmlFor="image-upload" 
                            className={`${isEditMode ? 'cursor-not-allowed' : ''} flex flex-col items-center justify-center h-32 cursor-pointer`}
                        >
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"/>
                            <span>Drag & drop or click to upload image</span>
                            <span className="text-xs text-muted-foreground mt-1">
                                JPEG, PNG, GIF, WEBP (max 5MB)
                            </span>
                        </Label>
                    ) : (
                        imageLoadingState ? 
                            <div className="flex items-center justify-center h-32">
                                <Skeleton className="w-full h-20 bg-gray-100" />
                            </div> :
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileIcon className="w-8 text-primary mr-2 h-8" />
                                    <div>
                                        <p className="text-sm font-medium truncate max-w-[200px]">
                                            {imageFile.name}
                                        </p>
                                        {uploadedImageUrl && (
                                            <p className="text-xs text-green-600">
                                                ✓ Uploaded successfully
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-muted-foreground hover:text-foreground" 
                                    onClick={handleRemoveImage}
                                >
                                    <XIcon className="w-4 h-4"/>
                                    <span className="sr-only">Remove File</span>
                                </Button>
                            </div>
                    )
                }
            </div>
            {uploadedImageUrl && (
                <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                        src={uploadedImageUrl} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg border"
                    />
                </div>
            )}
        </div>
    );
}

export default PeopleImageUpload;