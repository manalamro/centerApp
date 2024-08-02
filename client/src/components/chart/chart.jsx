import React, { useState, useEffect } from "react";
import { Card, Spin, Empty, Button, Table, message } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons'; // Import the icon
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CenterOperationalCostsList from "../centerOperationCosts/fetchOperation";
import {
  fetchEnrollmentsByMonth,
  fetchMostFamousCourse,
  fetchProfitFromEachCourse,
  TotalRevenueByMonth,
} from "../../utils/enrollmnetUtils";
import "./chart.css";
import { useAuth } from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";

const EnrollmentDataCards = () => {
  const [loading, setLoading] = useState(true);
  const [enrollmentsByMonth, setEnrollmentsByMonth] = useState({});
  const [mostFamousCourseTitles, setMostFamousCourseTitles] = useState([]);
  const [profitFromEachCourse, setProfitFromEachCourse] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState({});
  const [error,setError]= useState(undefined);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      message.error("An error occurred during logout.");
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentsData = await fetchEnrollmentsByMonth();
        setEnrollmentsByMonth(enrollmentsData);
        const famousCourseData = await fetchMostFamousCourse();
        setMostFamousCourseTitles(famousCourseData.mostFamousCourseTitles);

        const profitData = await fetchProfitFromEachCourse();
        setProfitFromEachCourse(profitData);

        const revenueData = await TotalRevenueByMonth();
        setRevenueByMonth(revenueData);
        setLoading(false);
      } catch (error) {
        message.error(error.response.data.error);
        setError(error.response.data.error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if(error==='Token expired, please log in again' ||
      error==='Token expired or invalid. Please log in again.'){
    return (
        <div>
          <h1>{error}</h1>
          <Button onClick={handleLogout}>
            Login again
          </Button>
          
        </div>

    )
    return;
  }
  const generatePDF = () => {
    const isWindowMaximized =
        window.outerWidth === window.screen.availWidth &&
        window.outerHeight === window.screen.availHeight;

    if (!isWindowMaximized) {
      alert(
          "Please maximize your browser window for optimal viewing, then click Generate PDF again."
      );
      return;
    } else {
      const element = document.getElementById("pdf-content");

      // Set background color of the canvas
      const canvasOptions = {
        backgroundColor: "rgb(228, 243, 241)", // Set the background color here
      };

      html2canvas(element, canvasOptions).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        // Set background color
        pdf.setFillColor(228, 243, 241);
        pdf.rect(0, 0, width, height, "F");

        // Calculate scaling factor for the content
        const scaleFactor = (width - 60) / canvas.width;

        // Add scaled image to PDF
        pdf.addImage(imgData, "PNG", 20, 10, canvas.width * scaleFactor, canvas.height * scaleFactor);
        pdf.save("enrollment_data.pdf");
      });
      message.success("Your PDF file generated successfully!");
    }
  };

  const renderEnrollmentsTable = () => {
    const enrollmentEntries = Object.entries(enrollmentsByMonth);

    if (enrollmentEntries.length === 0) {
      return (
          <span> it seem that you don't have enrollments yet, You should have enrolled students before.</span>
      );
    }

    const data = enrollmentEntries.map(([month, courses]) => {
      const courseData = Object.entries(courses).map(([course, enrollments]) => ({
        course,
        enrollments
      }));

      return {
        month,
        courses: courseData
      };
    });

    const columns = [
      {
        title: 'Month',
        dataIndex: 'month',
        key: 'month',
      },
      {
        title: 'Courses',
        dataIndex: 'courses',
        key: 'courses',
        render: (courses) => (
            <div style={{ width: '100%', overflowX: 'auto' }}> {/* Adjust width as needed */}
              <Table
                  dataSource={courses.map(({ course, enrollments }) => ({ course, enrollments }))}
                  columns={[
                    { title: 'Course', dataIndex: 'course', key: 'course' },
                    { title: 'Enrollments', dataIndex: 'enrollments', key: 'enrollments' }
                  ]}
                  pagination={false}
              />
            </div>
        )
      },
    ];

    return (
        <Table   style={{ overflowX: "auto" }}
                 dataSource={data}
                 columns={columns}
                 pagination={false}
        />
    );
  };

  const CourseColumns = [
    {
      title: "Course Title",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },
    {
      title: "Teacher Profit",
      dataIndex: "teacherProfit",
      key: "teacherProfit",
      render: (teacherProfit) => parseFloat(teacherProfit.toFixed(1)), // Limit to one decimal place
    },
    {
      title: "Center Profit",
      dataIndex: "centerProfit",
      key: "centerProfit",
      render: (centerProfit) => parseFloat(centerProfit.toFixed(1)), // Limit to one decimal place
    },
    {
      title: "Course Operational Costs",
      dataIndex: "operationalCosts",
      key: "operationalCosts",
      render: (operationalCosts) => parseFloat(operationalCosts.toFixed(1)), // Limit to one decimal place
    },
    {
      title: "Net Profit",
      dataIndex: "netProfit",
      key: "netProfit",
      render: (netProfit) => parseFloat(netProfit.toFixed(1)), // Limit to one decimal place
    },
    {
      title: "Loss",
      dataIndex: "loss",
      key: "loss",
      render: (loss) => (loss < 0 ? 0 : loss), // Return 0 if loss is less than 0
    },
    {
      title: "Is it Profitable",
      dataIndex: "isProfit",
      key: "isProfit",
      render: (isProfit) => (isProfit ? "Yes" : "No"), // Render Yes/No instead of true/false
    },
  ];

  const renderRevenueTable = () => {
    let revenueEntries = revenueByMonth;

    // Check if revenueEntries is an array
    if (!Array.isArray(revenueEntries)) {
      return <span>it seem that you don't have enrollments yet, so that there is No revenue data available.</span>;
    }

    // Sort the revenueEntries by month in ascending order
    revenueEntries.sort((a, b) => {
      const [aMonth, aYear] = a.month.split("-").map(Number);
      const [bMonth, bYear] = b.month.split("-").map(Number);
      if (aYear !== bYear) {
        return aYear - bYear;
      }
      return aMonth - bMonth;
    });

    return (
        <div style={{ overflowX: "auto" }}>
          <Table
              style={{ overflowX: "auto" }}
              dataSource={revenueEntries.map((entry) => ({
                month: entry.month,
                netProfit: parseFloat(entry.initialNetProfit.toFixed(1)), // Limit to one decimal place
                totalCenterOperationCosts: parseFloat(
                    entry.centerOperationsCosts.toFixed(1)
                ), // Limit to one decimal place
                theFinalRevenue:
                    entry.finalNetProfit < 0
                        ? 0
                        : parseFloat(entry.finalNetProfit.toFixed(1)), // Return 0 if the final net profit is less than 0, limit to one decimal place
              }))}
              columns={[
                {
                  title: "Month",
                  dataIndex: "month",
                  key: "month",
                },
                {
                  title: "Net Profit",
                  dataIndex: "netProfit",
                  key: "netProfit",
                },
                {
                  title: "Total Center Operation Costs",
                  dataIndex: "totalCenterOperationCosts",
                  key: "totalCenterOperationCosts",
                },
                {
                  title: "The Final Revenue",
                  dataIndex: "theFinalRevenue",
                  key: "theFinalRevenue",
                },
              ]}
              pagination={false}
          />
        </div>
    );
  };

  return (
      <div style={{ padding: 40 }}>
        <CenterOperationalCostsList />
        <div id="pdf-content">
          <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                textAlign: "center",
                flexDirection: "row",
              }}
          >
            {loading ? (
                <Spin/>
            ) : mostFamousCourseTitles.length > 0 ? (
                mostFamousCourseTitles.map((title, index) => (
                    <Card
                        id="chart"
                        key={index}
                        title={`Most Famous Course  ${index + 1}`}
                        style={{
                          margin: "0 10px 20px 0",
                          border: "none",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          textAlign: "center",
                        }}
                    >
                      <p className="titleP">{title}</p>
                    </Card>
                ))
            ) : (
                <Empty description="there is no enrollments yet"/>
            )}
          </div>

          <h4 style={{marginBottom: 20}}>Profit From Each Course</h4>
          {loading ? (
              <Spin />
          ) : profitFromEachCourse.length > 0 ? (
              <Table
                  style={{ overflowX: "auto" }}
                  dataSource={profitFromEachCourse}
                  columns={CourseColumns}
              />
          ) : (
              <span>No profit data available </span>
          )}

          <h4 style={{ marginBottom: 20 }}>Total Revenue By Month</h4>
          {loading ? <Spin /> : renderRevenueTable()}

          <h4 style={{ marginBottom: 20, marginTop: 60 }}>
            Enrollments By Month
          </h4>
          {renderEnrollmentsTable()}
        </div>

        <Button onClick={generatePDF} style={{ marginTop: 20 }}>
          Generate PDF
        </Button>
      </div>
  );
};

export default EnrollmentDataCards;
