import React from 'react';
import { BookOpen, Users, Clock, Target, ChevronRight, FileText } from 'lucide-react';

const StreamSelection = ({ 
  streams, 
  selectedStream, 
  onStreamSelect, 
  loading, 
  error 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading streams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Target className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">Failed to load streams</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Test Stream
        </h2>
        <p className="text-gray-600">
          Select an exam category to begin your practice test
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <div
            key={stream._id}
            onClick={() => onStreamSelect(stream)}
            className={`
              relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200
              hover:shadow-lg hover:scale-105
              ${selectedStream?._id === stream._id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${selectedStream?._id === stream._id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {stream.name}
                </h3>
              </div>
              <ChevronRight className={`
                h-5 w-5 transition-colors
                ${selectedStream?._id === stream._id
                  ? 'text-blue-600'
                  : 'text-gray-400'
                }
              `} />
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {stream.description}
            </p>

            {stream.resourceType && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-4">
                <FileText className="w-4 h-4" />
                <span>{stream.resourceType === 'pdf' ? 'Includes PDF resource' : 'Includes external resource'}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Popular choice</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>2-3 hours</span>
              </div>
            </div>

            {selectedStream?._id === stream._id && (
              <div className="absolute top-2 right-2">
                <div className="bg-blue-500 text-white rounded-full p-1">
                  <Target className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {streams.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No test streams available</p>
        </div>
      )}
    </div>
  );
};

export default StreamSelection;
