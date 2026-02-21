import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPersonById, deletePerson } from "@/store/people/people-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  MapPin,
  Briefcase,
  Calendar,
  User,
  FileText,
  Tag,
  Globe,
  Home,
  AtSign,
  Hash
} from "lucide-react";

function PersonDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { person, isLoading, error } = useSelector((state) => state.people);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPersonById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to load person details");
    }
  }, [error]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${person?.name}?`)) {
      setDeleteLoading(true);
      try {
        await dispatch(deletePerson(id)).unwrap();
        toast.success("Person deleted successfully");
        navigate("/people/list");
      } catch (error) {
        toast.error(error || "Failed to delete person");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!person) {
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
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header with navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/people/list")}
              className="hover:bg-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-semibold text-gray-900">Person Details</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/people/edit/${person.people_id}`)}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={person.image} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                    {getInitials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{person.name}</h2>
                    {person.tag_details && (
                      <Badge
                        style={{
                          backgroundColor: person.tag_details.colorname + "20",
                          color: person.tag_details.colorname,
                          borderColor: person.tag_details.colorname,
                        }}
                      >
                        {person.tag_details.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {person.role || "No role specified"}
                    {person.department && ` • ${person.department}`}
                  </p>
                  <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Added on {formatDate(person.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="font-medium">{person.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="font-medium">{person.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4" />
                      Company
                    </p>
                    <p className="font-medium">{person.company || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4" />
                      Role
                    </p>
                    <p className="font-medium">{person.role || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4" />
                      Department
                    </p>
                    <p className="font-medium">{person.department || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4" />
                      Street Address
                    </p>
                    <p className="font-medium">{person.street || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      City
                    </p>
                    <p className="font-medium">{person.city || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      State
                    </p>
                    <p className="font-medium">{person.state || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4" />
                      ZIP/Postal Code
                    </p>
                    <p className="font-medium">{person.zip || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4" />
                      Country
                    </p>
                    <p className="font-medium">{person.country || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {person.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-gray-700 whitespace-pre-wrap">{person.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonDetails;