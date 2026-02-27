import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboardStats } from "@/store/people/dashboard-slice";
import { checkCredits } from "@/store/people/people-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Tag,
  Calendar,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, isLoading } = useSelector((state) => state.dashboard);
  const { credits } = useSelector((state) => state.people);

  useEffect(() => {
    if (user?.id) {
      dispatch(checkCredits());
      dispatch(fetchDashboardStats());
    }
  }, [user?.id, dispatch]);

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
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          {/* Stats Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Contacts Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your contacts
            {credits !== undefined && (
              <span className="ml-2 text-sm">
                • Available Credits: <span className="font-semibold text-indigo-600">{credits}</span>
              </span>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={stats.total_contacts}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Added This Week"
            value={stats.contacts_this_week}
            icon={Calendar}
            color="bg-green-500"
          />
          <StatCard
            title="Total Tags"
            value={stats.total_tags}
            icon={Tag}
            color="bg-purple-500"
          />
        </div>

        {/* Recent Contacts */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Recent Contacts
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => navigate("/people/list")}
              className="text-indigo-600 hover:text-indigo-700"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recent_contacts && stats.recent_contacts.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_contacts.map((person) => (
                  <div
                    key={person.people_id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/people/${person.people_id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={person.image} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                          {getInitials(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          {person.email || "No email"}
                          {person.tag_details && (
                            <>
                              <span>•</span>
                              <Badge
                                style={{
                                  backgroundColor: person.tag_details.colorname + "20",
                                  color: person.tag_details.colorname,
                                  borderColor: person.tag_details.colorname,
                                }}
                                variant="outline"
                                className="text-xs"
                              >
                                {person.tag_details.name}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(person.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Get started by adding your first contact
                </p>
                <Button
                  onClick={() => navigate("/people/add")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Person
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/people/add")}
              >
                <UserPlus className="w-6 h-6" />
                <span>Add New Person</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/people/groups")}
              >
                <Tag className="w-6 h-6" />
                <span>Manage Tags</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/people/list")}
              >
                <Users className="w-6 h-6" />
                <span>View All Contacts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;