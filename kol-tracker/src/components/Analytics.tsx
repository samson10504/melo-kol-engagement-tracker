// File: src/components/Analytics.tsx

'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { calculateTokens, formatDate, getKolName } from '@/lib/utils';

interface AnalyticsProps {
  posts: any[];
  kols: any[];
  tokenSettings: { likesToToken: number; commentsToToken: number; };
}

export default function Analytics({ posts, kols, tokenSettings }: AnalyticsProps) {
  const engagementData = posts.flatMap(post => 
    post.counts.map((count: any) => ({
      ...count,
      kolName: getKolName(post.kolId, kols),
      postId: post.id
    }))
  );

  const kolPerformanceData = kols.map(kol => {
    const kolPosts = posts.filter(post => post.kol_id === kol.id);
    return {
      name: kol.name,
      totalLikes: kolPosts.reduce((sum, post) => sum + (post.counts[post.counts.length - 1]?.likes || 0), 0),
      totalComments: kolPosts.reduce((sum, post) => sum + (post.counts[post.counts.length - 1]?.comments || 0), 0),
      totalTokens: kolPosts.reduce((sum, post) => sum + calculateTokens(
        post.counts[post.counts.length - 1]?.likes || 0, 
        post.counts[post.counts.length - 1]?.comments || 0,
        tokenSettings.likesToToken,
        tokenSettings.commentsToToken
      ), 0)
    };
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trend by KOL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip labelFormatter={(value) => formatDate(value.toString())} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
                <Line yAxisId="right" type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>KOL Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kolPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLikes" fill="#8884d8" name="Total Likes" />
                <Bar dataKey="totalComments" fill="#82ca9d" name="Total Comments" />
                <Bar dataKey="totalTokens" fill="#ffc658" name="Total Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}