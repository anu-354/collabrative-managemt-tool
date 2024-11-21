import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';
import axios from 'axios';

const TaskProgressBar = ({ moduleID }) => {
  const [progress, setProgress] = useState(0); // Initial progress is 0%
  const [daysSubmitted, setDaysSubmitted] = useState(0); // Tracks number of submissions
  const [totalDays, setTotalDays] = useState(0); // Total days between start and deadline
  const [taskData, setTaskData] = useState(null); // Store task data
  const [loading, setLoading] = useState(true); // Loading state
  const [lastSubmissionDate, setLastSubmissionDate] = useState(null); // To track the last submission date

  // Fetch task data when component mounts or moduleID changes
  useEffect(() => {
    if (!moduleID) return; // Early return if moduleID is undefined

    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/tasks/${moduleID}`);
        const task = response.data;

        // Calculate total days between start date and deadline
        const daysBetween = Math.ceil((new Date(task.endDate) - new Date(task.startDate)) / (1000 * 60 * 60 * 24));
        setTotalDays(daysBetween);

        // Set days submitted from task data if it's saved
        setDaysSubmitted(task.submissions ? task.submissions.length : 0); // If submissions are saved in DB

        // Track the last submission date
        if (task.submissions && task.submissions.length > 0) {
          setLastSubmissionDate(task.submissions[task.submissions.length - 1].date); // Assuming task has date field for submissions
        }

        setTaskData(task);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task data:', error);
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [moduleID]);

  // Calculate percentage progress based on the number of days submitted
  useEffect(() => {
    if (totalDays > 0) {
      const progressPercentage = (daysSubmitted / totalDays) * 100;
      setProgress(progressPercentage);
    }
  }, [daysSubmitted, totalDays]);

  // Check if today is a new day
  const isNewDay = () => {
    const today = new Date();
    const lastSubmission = new Date(lastSubmissionDate);
    return today.toDateString() !== lastSubmission.toDateString(); // Checks if it's a new day
  };

  // Handle task submission (to increment the number of submitted days)
  const handleSubmission = () => {
    if (daysSubmitted < totalDays && isNewDay()) {
      setDaysSubmitted(daysSubmitted + 1);
      // Here you can also send submission data to the server via axios

      // Update the last submission date
      const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      setLastSubmissionDate(today);
    }
  };

  // Show loading screen if data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="progress-bar-container rounded col-sm-12">
      <h3>Task Progress</h3>
      {taskData ? (
        <div>
          {/* <p>Module Name: {taskData.projectName}</p> */}
          <p>Days Submitted: {daysSubmitted}/{totalDays}</p>
          <div className="p-3">
            <BootstrapProgressBar now={progress} label={`${Math.round(progress)}%`} />
            <p>{`Progress: ${Math.round(progress)}%`}</p> {/* Optional for Debugging */}
          </div>

          {/* Submit Button: Disabled if all tasks are submitted or if a submission was made today */}
          <Button
            variant="primary"
            onClick={handleSubmission}
            disabled={daysSubmitted >= totalDays || !isNewDay()} // Disable if all tasks are submitted or if a submission was made today
            className="mt-3"
          >
            Submit Today Task
          </Button>
        </div>
      ) : (
        <p>Loading task data...</p>
      )}

      {/* Embedded CSS */}
      <style>
        {`
          /* Example to change button appearance when disabled */
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .progress-bar-container {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
            background-color: #f9f9f9;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
            transition: transform 0.3s ease-in-out;
          }

          .progress-bar-container:hover {
            transform: scale(1.02);
          }

          .task-info p {
            font-size: 1.1rem;
            color: #333;
          }

          .progress-bar-wrapper {
            position: relative;
            animation: slideIn 1s ease-out;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .progress-bar-container h3 {
            color: #0069d9;
          }
        `}
      </style>
    </div>
  );
};

export default TaskProgressBar;
