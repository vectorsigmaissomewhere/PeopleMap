import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPeopleFormElements } from "@/config";
import PeopleImageUpload from "@/components/people-view/image-upload";
import { 
  updatePerson, 
  fetchPersonById, 
  clearCurrentPerson,
  clearPeopleState 
} from "@/store/people/people-slice";
import { fetchTags } from "@/store/people/tags-slice";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

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

function EditPerson() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { person, isLoading, error, success, message } = useSelector((state) => state.people);
  const { tags } = useSelector((state) => state.tags);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Load tags and person data
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTags(user.id));
    }
    
    // Clear previous person data and fetch new one
    dispatch(clearCurrentPerson());
    if (id) {
      dispatch(fetchPersonById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentPerson());
      dispatch(clearPeopleState());
    };
  }, [id, user?.id, dispatch]);

  // Populate form when person data is loaded
  useEffect(() => {
    if (person && person.people_id === parseInt(id)) {
      setFormData({
        name: person.name || "",
        email: person.email || "",
        phone: person.phone || "",
        company: person.company || "",
        role: person.role || "",
        department: person.department || "",
        street: person.street || "",
        city: person.city || "",
        state: person.state || "",
        zip: person.zip || "",
        country: person.country || "",
        notes: person.notes || "",
        tag: person.tag ? String(person.tag) : "",
        image: person.image || ""
      });
      if (person.image) {
        setUploadedImageUrl(person.image);
      }
      setInitialLoadComplete(true);
    }
  }, [person, id]);

  // Handle success/error messages
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearPeopleState());
      navigate(`/people/${id}`);
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Failed to update person');
      setIsSubmitting(false);
      dispatch(clearPeopleState());
    }
  }, [success, error, message, navigate, id, dispatch]);

  // Update form when image is uploaded
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl
      }));
    }
  }, [uploadedImageUrl]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isLoading) {
      return;
    }

    if (!formData.name?.trim()) {
      toast.warning("Name is required");
      return;
    }

    if (!formData.notes?.trim()) {
      toast.warning("Notes are required");
      return;
    }

    // Prepare data for submission
    const submitData = { ...formData };

    // If no tag selected, remove the field
    if (!submitData.tag) {
      delete submitData.tag;
    }

    setIsSubmitting(true);

    try {
      await dispatch(updatePerson({
        personId: id,
        personData: submitData
      })).unwrap();
    } catch (error) {
      console.error("Failed to update person:", error);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleTagChange = (value) => {
    handleInputChange("tag", value === "no-tag" ? "" : value);
  };

  const handleCancel = () => {
    dispatch(clearCurrentPerson());
    dispatch(clearPeopleState());
    navigate(`/people/${id}`);
  };

  if (isLoading && !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading person details...</p>
        </div>
      </div>
    );
  }

  if (!person && initialLoadComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Person not found</h2>
          <Button onClick={() => navigate("/people/list")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to People List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Button
                        variant="ghost"
                        onClick={() => navigate("/people/list")}
                        className="hover:bg-gray-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Person</h1>
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
              isEditMode={true}
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
                      disabled={isSubmitting || isLoading}
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
                      disabled={isSubmitting || isLoading}
                    />
                  )}
                </div>
              ))}

              {/* Tag Selection */}
              <div className="md:col-span-2">
                <Label htmlFor="tag" className="text-sm font-medium">Assign Tag (Optional)</Label>
                <Select
                  value={formData.tag || "no-tag"}
                  onValueChange={handleTagChange}
                  disabled={isSubmitting || isLoading}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-tag">No Tag</SelectItem>
                    {tags && tags.length > 0 ? (
                      tags.map((tag) => {
                        const tagId = tag.tags_id || tag.id;
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
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2.5"
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 min-w-[120px]"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPerson;