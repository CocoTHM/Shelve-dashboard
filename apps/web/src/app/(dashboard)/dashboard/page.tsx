'use client';

import { useQuery } from '@tanstack/react-query';
import { statsApi, servicesApi, voiceApi } from '@/lib/api';
import { useServerStore } from '@/stores/server-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, Activity, Mic } from 'lucide-react';
import { formatNumber, formatDuration, getDiscordAvatarUrl } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { selectedServer } = useServerStore();

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', selectedServer?.id],
    queryFn: () => statsApi.getDashboardStats(selectedServer!.id).then((res) => res.data),
    enabled: !!selectedServer,
  });

  const { data: activityData } = useQuery({
    queryKey: ['activity-graph', selectedServer?.id],
    queryFn: () => statsApi.getActivityGraph(selectedServer!.id, 7).then((res) => res.data),
    enabled: !!selectedServer,
  });

  const { data: activeServices } = useQuery({
    queryKey: ['active-services', selectedServer?.id],
    queryFn: () => servicesApi.getActive(selectedServer!.id).then((res) => res.data),
    enabled: !!selectedServer,
  });

  const { data: activeSessions } = useQuery({
    queryKey: ['active-sessions', selectedServer?.id],
    queryFn: () => voiceApi.getActiveSessions(selectedServer!.id).then((res) => res.data),
    enabled: !!selectedServer,
  });

  if (!selectedServer) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Sélectionnez un serveur pour commencer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Vue d'ensemble de votre serveur Discord</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatNumber(stats.totalMembers) : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff en Service</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.activeServices : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions Aujourd'hui</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatNumber(stats.todayConnections) : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Vocales Actives</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.activeSessions : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Graph */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Activité (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            {activityData && activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="connections"
                    stroke="#8884d8"
                    name="Connexions"
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueUsers"
                    stroke="#82ca9d"
                    name="Utilisateurs uniques"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-500">
                Pas de données disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Members */}
        <Card>
          <CardHeader>
            <CardTitle>Top Membres (Temps Vocal)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topMembers && stats.topMembers.length > 0 ? (
                stats.topMembers.map((member: any, index: number) => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getDiscordAvatarUrl(member.id, member.avatar)}
                        alt={member.username}
                      />
                      <AvatarFallback>{member.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.username}</p>
                      <p className="text-xs text-gray-500">
                        {formatDuration(Number(member.total_time))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucune donnée disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeServices && activeServices.length > 0 ? (
                activeServices.map((service: any) => (
                  <div key={service.id} className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getDiscordAvatarUrl(
                          service.user.discordId,
                          service.user.avatar
                        )}
                        alt={service.user.username}
                      />
                      <AvatarFallback>{service.user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{service.user.username}</p>
                      <p className="text-xs text-gray-500">{service.channelName}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun service en cours</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
