import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, DollarSign, TrendingUp, Plus, Clock, Calendar, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const statsCards = [
    {
      title: "Total Members",
      value: "248",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      description: "Active memberships"
    },
    {
      title: "Today's Check-ins",
      value: "87",
      change: "+8%",
      changeType: "positive", 
      icon: UserCheck,
      description: "Member attendance"
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      change: "+15%",
      changeType: "positive",
      icon: DollarSign,
      description: "This month's earnings"
    },
    {
      title: "Active Trainers",
      value: "12",
      change: "0%",
      changeType: "neutral",
      icon: TrendingUp,
      description: "Staff on duty"
    }
  ];

  const recentMembers = [
    { name: "John Smith", joinDate: "2024-01-15", status: "Active", plan: "Premium" },
    { name: "Sarah Johnson", joinDate: "2024-01-14", status: "Active", plan: "Basic" },
    { name: "Mike Wilson", joinDate: "2024-01-13", status: "Pending", plan: "Premium" },
    { name: "Emma Davis", joinDate: "2024-01-12", status: "Active", plan: "Student" },
  ];

  const expiringSoon = [
    { name: "Robert Brown", expiry: "2024-02-01", plan: "Premium" },
    { name: "Lisa Anderson", expiry: "2024-02-03", plan: "Basic" },
    { name: "David Miller", expiry: "2024-02-05", plan: "Premium" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your gym today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-success' : 
                  stat.changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Members */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Recent Members
            </CardTitle>
            <CardDescription>Latest member registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMembers.map((member, index) => (
                <div key={member.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">Joined {member.joinDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'Active' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {member.status}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">{member.plan} Plan</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Members
            </Button>
          </CardContent>
        </Card>

        {/* Memberships Expiring Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Memberships requiring renewal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringSoon.map((member, index) => (
                <div key={member.name} className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <p className="font-medium text-foreground text-sm">{member.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Expires: {member.expiry}</p>
                  <p className="text-xs text-muted-foreground">{member.plan} Plan</p>
                </div>
              ))}
            </div>
            <Button variant="warning" size="sm" className="w-full mt-4">
              Send Renewal Reminders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Add Member</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <UserCheck className="h-6 w-6" />
              <span className="text-sm">Mark Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Process Payment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;