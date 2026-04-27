import React from 'react';
import { Link } from 'react-router-dom';

const CommunityIndex: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Faceless Solopreneur Community</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with like-minded entrepreneurs, learn from successful creators, and grow your faceless business together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Link to="/community/members" className="group bg-card border rounded-xl p-6 hover:border-primary transition-colors">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Member Directory</h3>
          <p className="text-muted-foreground">Browse our community members, connect with other solopreneurs</p>
        </Link>

        <Link to="/community/events" className="group bg-card border rounded-xl p-6 hover:border-primary transition-colors">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Events</h3>
          <p className="text-muted-foreground">Join live workshops, Q&A sessions, and virtual meetups</p>
        </Link>

        <Link to="/community/challenges" className="group bg-card border rounded-xl p-6 hover:border-primary transition-colors">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Challenges</h3>
          <p className="text-muted-foreground">Participate in growth challenges and compete with fellow members</p>
        </Link>
      </div>

      <div className="bg-muted rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get full access?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Create an account to join discussions, participate in challenges, and get access to the full community features.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth/signup" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Join Community
          </Link>
          <Link to="/auth/login" className="border px-6 py-3 rounded-lg font-medium hover:bg-background transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityIndex;