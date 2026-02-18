import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchPeople,
    setFilters,
    clearFilters,
    setCurrentPage,
    setPageSize,
    deletePerson
} from "@/store/people/people-slice";
import { fetchTags } from "@/store/people/tags-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    Search,
    X,
    MoreVertical,
    Edit,
    Trash2,
    UserPlus,
    Filter,
    Loader2
} from "lucide-react";

function PeopleList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { people, isLoading, pagination, filters, credits } = useSelector((state) => state.people);
    const { tags } = useSelector((state) => state.tags);

    // Local state for debounced search
    const [localSearch, setLocalSearch] = useState(filters?.search || "");
    const [localTag, setLocalTag] = useState(filters?.tag || "all");
    const [localCompany, setLocalCompany] = useState(filters?.company || "");
    const [localCity, setLocalCity] = useState(filters?.city || "");
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);

    // Ensure people is always an array
    const peopleArray = Array.isArray(people) ? people : [];

    // Load initial data
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTags(user.id));
            loadPeople();
        }
    }, [user?.id]);

    // Load people when filters or pagination change
    useEffect(() => {
        if (user?.id) {
            loadPeople();
        }
    }, [filters, pagination?.currentPage, pagination?.pageSize]);

    const loadPeople = () => {
        dispatch(fetchPeople({
            userId: user.id,
            page: pagination?.currentPage || 1,
            pageSize: pagination?.pageSize || 10,
            search: filters?.search || '',
            tag: filters?.tag || '',
            company: filters?.company || '',
            city: filters?.city || ''
        }));
    };

    // Handle search with debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearch(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            dispatch(setFilters({ search: value }));
            dispatch(setCurrentPage(1));
        }, 500);

        setDebounceTimeout(timeout);
    };

    // Handle tag filter
    const handleTagFilter = (value) => {
        setLocalTag(value);
        dispatch(setFilters({ tag: value === "all" ? "" : value }));
        dispatch(setCurrentPage(1));
    };

    // Handle company filter
    const handleCompanyFilter = (e) => {
        const value = e.target.value;
        setLocalCompany(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            dispatch(setFilters({ company: value }));
            dispatch(setCurrentPage(1));
        }, 500);

        setDebounceTimeout(timeout);
    };

    // Handle city filter
    const handleCityFilter = (e) => {
        const value = e.target.value;
        setLocalCity(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            dispatch(setFilters({ city: value }));
            dispatch(setCurrentPage(1));
        }, 500);

        setDebounceTimeout(timeout);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setLocalSearch("");
        setLocalTag("all");
        setLocalCompany("");
        setLocalCity("");
        dispatch(clearFilters());
        dispatch(setCurrentPage(1));
    };

    // Handle page change
    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    // Handle delete person
    const handleDelete = async (personId, personName) => {
        if (window.confirm(`Are you sure you want to delete ${personName}?`)) {
            setDeleteLoading(personId);
            try {
                await dispatch(deletePerson(personId)).unwrap();
                toast.success("Person deleted successfully");
            } catch (error) {
                toast.error(error || "Failed to delete person");
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    // Calculate total pages with safe access
    const totalPages = Math.ceil((pagination?.count || 0) / (pagination?.pageSize || 10));

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        if (totalPages <= 1) return [];

        const pages = [];
        const maxVisible = 5;
        const halfVisible = Math.floor(maxVisible / 2);

        let start = Math.max(1, (pagination?.currentPage || 1) - halfVisible);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">People Directory</h1>
                        <p className="text-gray-500 mt-1">
                            Manage and view all your contacts
                            {credits !== undefined && (
                                <span className="ml-2 text-sm">
                                    (Credits: <span className="font-semibold text-indigo-600">{credits}</span>)
                                </span>
                            )}
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/people/add")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add New Person
                    </Button>
                </div>

                {/* Filters Card */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Filters</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {showFilters ? "Hide" : "Show"} Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name, email, company, city, phone..."
                                    value={localSearch}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filter Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Tag Filter */}
                                <Select value={localTag} onValueChange={handleTagFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tags</SelectItem>
                                        <SelectItem value="none">No Tag</SelectItem>
                                        {Array.isArray(tags) && tags?.map((tag) => (
                                            <SelectItem key={tag?.tags_id} value={String(tag?.tags_id)}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: tag?.colorname || "#808080" }}
                                                    />
                                                    {tag?.name || "Unknown"}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Company Filter */}
                                <Input
                                    placeholder="Filter by company..."
                                    value={localCompany}
                                    onChange={handleCompanyFilter}
                                />

                                {/* City Filter */}
                                <Input
                                    placeholder="Filter by city..."
                                    value={localCity}
                                    onChange={handleCityFilter}
                                />
                            </div>

                            {/* Active Filters & Clear Button */}
                            {(filters?.search || filters?.tag || filters?.company || filters?.city) && (
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {filters?.search && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                Search: {filters.search}
                                                <X
                                                    className="w-3 h-3 ml-1 cursor-pointer"
                                                    onClick={() => {
                                                        setLocalSearch("");
                                                        dispatch(setFilters({ search: "" }));
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {filters?.tag && filters.tag !== "none" && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                Tag: {Array.isArray(tags) && tags.find(t => t?.tags_id === parseInt(filters.tag))?.name || filters.tag}
                                                <X
                                                    className="w-3 h-3 ml-1 cursor-pointer"
                                                    onClick={() => {
                                                        setLocalTag("all");
                                                        dispatch(setFilters({ tag: "" }));
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {filters?.tag === "none" && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                Tag: No Tag
                                                <X
                                                    className="w-3 h-3 ml-1 cursor-pointer"
                                                    onClick={() => {
                                                        setLocalTag("all");
                                                        dispatch(setFilters({ tag: "" }));
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {filters?.company && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                Company: {filters.company}
                                                <X
                                                    className="w-3 h-3 ml-1 cursor-pointer"
                                                    onClick={() => {
                                                        setLocalCompany("");
                                                        dispatch(setFilters({ company: "" }));
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                        {filters?.city && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                City: {filters.city}
                                                <X
                                                    className="w-3 h-3 ml-1 cursor-pointer"
                                                    onClick={() => {
                                                        setLocalCity("");
                                                        dispatch(setFilters({ city: "" }));
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                                        Clear All
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Results Info */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{peopleArray.length}</span> of{" "}
                        <span className="font-medium">{pagination?.count || 0}</span> people
                    </p>
                    <Select
                        value={String(pagination?.pageSize || 10)}
                        onValueChange={(value) => dispatch(setPageSize(parseInt(value)))}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="25">25 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                            <SelectItem value="100">100 per page</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* People Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Tag</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Loading skeletons
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-[150px]" />
                                                        <Skeleton className="h-3 w-[100px]" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[60px]" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-[60px] ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : peopleArray.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <UserPlus className="w-12 h-12 mb-4 text-gray-400" />
                                                <h3 className="text-lg font-medium mb-2">No people found</h3>
                                                <p className="text-sm mb-4">
                                                    {filters?.search || filters?.tag || filters?.company || filters?.city
                                                        ? "Try adjusting your filters"
                                                        : "Get started by adding your first person"}
                                                </p>
                                                {!filters?.search && !filters?.tag && !filters?.company && !filters?.city && (
                                                    <Button
                                                        onClick={() => navigate("/people/add")}
                                                        variant="outline"
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Add Person
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    peopleArray.map((person) => (
                                        <TableRow key={person?.people_id} className="cursor-pointer hover:bg-gray-50">
                                            <TableCell onClick={() => navigate(`/people/${person?.people_id}`)}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={person?.image} />
                                                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                            {getInitials(person?.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{person?.name || "Unknown"}</div>
                                                        <div className="text-sm text-gray-500">{person?.role || "No role"}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell onClick={() => navigate(`/people/${person?.people_id}`)}>
                                                <div className="text-sm">
                                                    <div>{person?.email || "No email"}</div>
                                                    <div className="text-gray-500">{person?.phone || "No phone"}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell onClick={() => navigate(`/people/${person?.people_id}`)}>
                                                {person?.company || "-"}
                                            </TableCell>
                                            <TableCell onClick={() => navigate(`/people/${person?.people_id}`)}>
                                                {[person?.city, person?.state, person?.country]
                                                    .filter(Boolean)
                                                    .join(", ") || "-"}
                                            </TableCell>
                                            <TableCell onClick={() => navigate(`/people/${person?.people_id}`)}>
                                                {person?.tag_details ? (
                                                    <Badge
                                                        style={{
                                                            backgroundColor: (person.tag_details.colorname || "#808080") + '20',
                                                            color: person.tag_details.colorname || "#808080",
                                                            borderColor: person.tag_details.colorname || "#808080"
                                                        }}
                                                        variant="outline"
                                                    >
                                                        {person.tag_details.name || "Tag"}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400">No tag</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/people/${person?.people_id}`)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/people/edit/${person?.people_id}`)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(person?.people_id, person?.name)}
                                                            disabled={deleteLoading === person?.people_id}
                                                            className="text-red-600"
                                                        >
                                                            {deleteLoading === person?.people_id ? (
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                            )}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                                        className={(pagination?.currentPage || 1) === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((pageNum) => (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(pageNum)}
                                            isActive={pagination?.currentPage === pageNum}
                                            className="cursor-pointer"
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                                    <>
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                onClick={() => handlePageChange(totalPages)}
                                                className="cursor-pointer"
                                            >
                                                {totalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                                        className={(pagination?.currentPage || 1) === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PeopleList;
