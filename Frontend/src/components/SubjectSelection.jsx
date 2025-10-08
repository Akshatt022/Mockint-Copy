import React from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Target } from 'lucide-react';

const SubjectSelection = ({ 
  subjects, 
  selectedSubjects, 
  onSubjectToggle, 
  onBack, 
  onNext,
  loading, 
  error,
  streamName 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading subjects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Target className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">Failed to load subjects</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Streams</span>
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Subjects for {streamName}
        </h2>
        <p className="text-gray-600">
          Choose one or more subjects for your practice test
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.some(s => s._id === subject._id);
          
          return (
            <div
              key={subject._id}
              onClick={() => onSubjectToggle(subject)}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                hover:shadow-md
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isSelected
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {subject.name}
                  </h3>
                </div>
                
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected && (
                    <ChevronRight className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No subjects available for this stream</p>
        </div>
      )}

      {selectedSubjects.length > 0 && (
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
          </div>
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Next Step</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubjectSelection;