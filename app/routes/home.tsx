import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import type { Route } from './+types/home';
import { Link } from 'react-router';

type Issue = {
  _id: string;
  title: string;
  description: string;
  image?: string;
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard' }];
}

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching issues...");
    fetch('http://localhost:5000/api/issues')
      .then(res => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data: Issue[]) => {
        console.log("Fetched issues data:", data);
        setIssues(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching issues:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log('📦 Current issues state:', issues);
  }, [issues]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
              Issues Dashboard
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Discover and explore community issues
            </p>
          </div>
          
          <Link to="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold">
              Login
            </Button>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Issues grid */}
        {!isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue, index) => (
              <div
                key={issue._id}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/50 hover:border-white/80 transform hover:scale-[1.02] transition-all duration-500"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                {/* Image container */}
                <div className="relative overflow-hidden">
                  {issue.image ? (
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                    {issue.title}
                  </h2>
                  
                  <p className="text-slate-600 leading-relaxed line-clamp-3">
                    {issue.description}
                  </p>
                  
                  <Link to={`/issues/${issue._id}`}>
                    <Button className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                      View Details
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && issues.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Issues Found</h3>
            <p className="text-slate-600">Check back later for new community issues.</p>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}