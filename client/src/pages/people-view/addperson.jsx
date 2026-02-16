import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPeopleFormElements } from "@/config";
import PeopleImageUpload from "@/components/people-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewPeople, checkCredits } from "@/store/people/people-slice";
import { fetchTags } from "@/store/people/tags-slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  department: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  notes: "",
  tag: "",
  image: ""
};

function AddPerson() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { tags } = useSelector((state) => state.tags);
  const { isLoading, success, error, message, credits } = useSelector((state) => state.people);
  
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTags(user.id));
      dispatch(checkCredits());
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (success && message) {
       toast.success(message);
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    navigate("/people/add");
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Failed to add person');
    }
  }, [success, error, message, navigate]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl
      }));
    }
  }, [uploadedImageUrl]);

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.warning("Name is required");
      return;
    }
    
    if (!formData.notes?.trim()) {
      toast.warning("Notes are required");
      return;
    }

    if (credits < 1) {
      toast.error("Insufficient credits. Please purchase more credits to add a person.");
      return;
    }

    const submitData = { ...formData };
    
    if (!submitData.tag) {
      delete submitData.tag;
    }

    dispatch(addNewPeople(submitData));
  };

  // Handle form field changes
  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };
  const handleTagChange = (value) => {
    handleInputChange("tag", value === "no-tag" ? "" : value);
  };

  useEffect(() => {
    if (tags && tags.length > 0) {
      console.log("Tags structure:", tags[0]);
    }
  }, [tags]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Add New Person</h1>
          <p className="text-gray-500 mt-1">Fill in the details to add a new person (Cost: 1 credit)</p>
          {credits !== undefined && (
            <p className="text-sm mt-2">
              Available Credits: <span className="font-semibold text-indigo-600">{credits}</span>
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <PeopleImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              imageLoadingState={imageLoadingState}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
            />
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4 text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addPeopleFormElements.map((element) => (
                <div key={element.name} className={element.name === 'notes' ? 'md:col-span-2' : ''}>
                  <Label htmlFor={element.name} className="text-sm font-medium">
                    {element.label}
                    {element.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {element.componentType === "textarea" ? (
                    <textarea
                      id={element.name}
                      value={formData[element.name] || ""}
                      onChange={(e) => handleInputChange(element.name, e.target.value)}
                      placeholder={element.placeholder}
                      className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-base mt-1"
                      rows={4}
                      required={element.required}
                    />
                  ) : (
                    <Input
                      id={element.name}
                      type={element.type || "text"}
                      value={formData[element.name] || ""}
                      onChange={(e) => handleInputChange(element.name, e.target.value)}
                      placeholder={element.placeholder}
                      className="mt-1"
                      required={element.required}
                    />
                  )}
                </div>
              ))}

              {/* Tag Selection - Fixed Version */}
              <div className="md:col-span-2">
                <Label htmlFor="tag" className="text-sm font-medium">Assign Tag (Optional)</Label>
                <Select
                  value={formData.tag || "no-tag"}
                  onValueChange={handleTagChange}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Use a special value "no-tag" instead of empty string */}
                    <SelectItem value="no-tag">No Tag</SelectItem>
                    {tags && tags.length > 0 ? (
                      tags.map((tag) => {
                        // Get the tag ID - check both possible property names
                        const tagId = tag.tags_id || tag.id;
                        // Get the color - check both possible property names
                        const tagColor = tag.colorname || tag.color || "#808080";
                        
                        return (
                          <SelectItem key={tagId} value={String(tagId)}>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tagColor }}
                              />
                              {tag.name || tag.tag_name}
                            </div>
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem value="no-tags-available" disabled>
                        No tags available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {(!tags || tags.length === 0) && (
                  <p className="text-sm text-gray-500 mt-2">
                    No tags found. Create tags first in the Tags section.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/people/list")}
              className="px-6 py-2.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || credits < 1}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5"
            >
              {isLoading ? "Adding..." : "Add Person"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPerson;