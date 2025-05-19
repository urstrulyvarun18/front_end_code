import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion,Divider,Button, FormItemSelect, FlexLayout,Title, Loader, ContainerLayout,FlexItem,Separator,DotIcon,TextLabel,MenuGroup, OldTooltip,OrderedList,Menu,MenuItem, UnorderedList, StackingLayout} from "@nutanix-ui/prism-reactjs";
import FsctComparisonTable from './FsctComparisonTable'; // Import the ComparisonTable component
import { Table } from '@nutanix-ui/prism-reactjs';

const FsctCascadingDropdowns = () => {
  const [suites, setSuites] = useState([]);
  const [releases1, setReleases1] = useState([]);
  const [runDates1, setRunDates1] = useState([]);
  const [commitIds1, setCommitIds1] = useState([]);
  const [releases2, setReleases2] = useState([]);
  const [runDates2, setRunDates2] = useState([]);
  const [commitIds2, setCommitIds2] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const[tableCellAlerts,setTableCellAlerts]= useState([]);
  const[hideSecondRow,setHideSecondRow]= useState([false]);

  const[runConfigs,setRunConfigs] = useState([]);
  const[subdataUID1,setSubdataUID1] = useState([]);
  const[subdataUID2,setSubdataUID2] = useState([]);
  
  const[compareTableData,setCompareTableData] = useState([]);
  const[showCompareTable,setShowCompareTable] = useState(false);
  const[isCompareLoading,setIsCompareLoading] = useState(false);
  const[isSubmitLoading,setIsSubmitLoading] = useState(false);
  const [disableSubmitbutton, setDisableSubmitButton] = useState(false);
  const [disableComparebutton, setDisableCompareButton] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
   const[expandedAccordion, setExpandedAccordion] = useState(1);
   const[counterInfoData,setCounterInfoData]=useState([]);
  const[summaryData,setSummaryData]=useState(null);
   const[counterInfoTableAlerts, setCounterInfoTableAlerts] = useState([]);
   const [hasInitiatedCompare,setHasInitiatedCompare] = useState(false);
   // Add these state variables with your other state declarations
const [grafanaStatsData, setGrafanaStatsData] = useState([]);
const [grafanaStatsAlerts, setGrafanaStatsAlerts] = useState({});
   
  const compareColumns = [
    {
      title: 'Workload Name',
      key: 'fsct_suite_name',
      dataIndex: 'fsct_suite_name',
      fixed: true,
      render: (value) => value,
    },
    {
      title: 'Run Config',
      key: 'run_config',
      dataIndex: 'run_config',
      textalign:'center',
      fixed: true,
      render: (value) => value,
    },
    {
      title: 'User Count',
      key: 'user_count',
      dataIndex: 'user_count',
      textalign:'center',
      fixed: true,
    },
   
    {
      title: 'Overload',
      key: 'overload',
      group: [
        {
          title: 'Run 1',
          key: 'overload_run_1',
          dataIndex: 'overload_run_1',
          textalign:'center',
          
        },
        {
          title: 'Run 2',
          key: 'overload_run_2',
          dataIndex: 'overload_run_2',
          textalign:'center',
          onCell: (record) => ({
            alert: record?.overload_alert
          })
        }
      ]
    },
    {
      title: 'Throughput',
      key: 'throughput',
      group: [
        {
          title: 'Run 1',
          key: 'throughput_run_1',
          dataIndex: 'throughput_run_1',
          textalign:'center',
          
        },
        {
          title: 'Run 2',
          key: 'throughput_run_2',
          dataIndex: 'throughput_run_2',
          textalign:'center',
          onCell: (record) => ({
            alert: record?.throughput_alert
          })
        }
      ]
    },
    {
      title: 'Errors',
      key: 'errors',
      group: [
        {
          title: 'Run 1',
          key: 'errors_run_1',
          dataIndex: 'errors_run_1',
          textalign:'center',
          
        },
        {
          title: 'Run 2',
          key: 'errors_run_2',
          dataIndex: 'errors_run_2',
          textalign:'center',
          onCell: (record) => ({
            alert: record?.errors_alert
          })
        }
      ]
    },
  ];

  const counterInfoColumns = [
    {
      title: 'Workload Name',
      key: 'fsct_suite_name',
      dataIndex: 'fsct_suite_name',
      render: (value) => value,
    },
    {
      title: 'Run Config',
      key: 'run_config',
      dataIndex: 'run_config',
      textalign:'center',
      render: (value) => value,
    },
    {
      title: 'User Count',
      key: 'user_count',
      dataIndex: 'user_count',
      render: (value) => value,
    },
    {
      title: 'Val Type',
      key: 'val_type',
      dataIndex: 'val_type',
      render: (value) => value,
    },
    {
      title: 'Close',
      key: 'close',
      group: [
        {
          title: 'Run 1',
          key: 'close_run_1',
          dataIndex: 'close_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'close_run_2',
          dataIndex: 'close_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.close_alert
          })
        }
      ]
    },
    {
      title: 'Create',
      key: 'create_stat',
      group: [
        {
          title: 'Run 1',
          key: 'create_stat_run_1',
          dataIndex: 'create_stat_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'create_stat_run_2',
          dataIndex: 'create_stat_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.create_stat_alert
          })
        }
      ]
    },
    // Continue with similar structure for other nested columns
    {
      title: 'Read',
      key: 'read_stat',
      group: [
        {
          title: 'Run 1',
          key: 'read_stat_run_1',
          dataIndex: 'read_stat_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'read_stat_run_2',
          dataIndex: 'read_stat_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.read__stat_alert
            })
        }
      ]
    },
    {
      title: 'Write',
      key: 'write_stat',
      group: [
        {
          title: 'Run 1',
          key: 'write_stat_run_1',
          dataIndex: 'write_stat_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'write_stat_run_2',
          dataIndex: 'write_stat_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.write_stat_alert
            })
        }
      ]
    },
    {
      title: 'Ioctl',
      key: 'ioctl',
      group: [
        {
          title: 'Run 1',
          key: 'ioctl_run_1',
          dataIndex: 'ioctl_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'ioctl_run_2',
          dataIndex: 'Ioctl_run_2',
          textalign: 'center',
          onCell: (record) => ({  
            alert: record.ioctl_alert
            })
        }
      ]
    },
    {
      title: 'Logoff',
      key: 'logoff',
      group: [
        {
          title: 'Run 1',
          key: 'logoff_run_1',
          dataIndex: 'logoff_run_1',
           textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'logoff_run_2',
          dataIndex: 'logoff_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.logoff_alert
            })
        }
      ]
    },
    {
      title: 'Metadata',
      key: 'metadata',
      group: [
        {
          title: 'Run 1',
          key: 'metadata_run_1',
          dataIndex: 'metadata_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'metadata_run_2',
          dataIndex: 'metadata_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.metadata_alert
            })
        }
      ]
    },
    {
      title: 'Negotiate',
      key: 'negotiate',
      group: [
        {
          title: 'Run 1',
          key: 'negotiate_run_1',
          dataIndex: 'negotiate_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'negotiate_run_2',
          dataIndex: 'negotiate_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.negotiate_alert
            })
        }
      ]
    },
    {
      title: 'Other',
      key: 'other',
      group: [
        {
          title: 'Run 1',
          key: 'other_run_1',
          dataIndex: 'other_run_1',
          textAlign: 'center',
          },
          {
            title: 'Run 2',
            key: 'other_run_2',
            dataIndex: 'other_run_2',
            textAlign: 'center',
            onCell: (record) => ({
              alert: record.other_alert
              })
              }
              ]
    },
    {
      title: 'Query Dir',
      key: 'query_dir',
      group: [
        {
          title: 'Run 1',
          key: 'query_dir_run_1',
          dataIndex: 'query_dir_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'query_dir_run_2',
          dataIndex: 'query_dir_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.query_dir_alert
            })
        }
      ]
    },
    {
      title: 'Query Info',
      key: 'query_info',
      group: [
        {
          title: 'Run 1',
          key: 'query_info_run_1',
          dataIndex: 'query_info_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'query_info_run_2',
          dataIndex: 'query_info_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.query_info_alert
            })
        }
      ]
    },
    {
      title: 'Sess Setup',
      key: 'sess_setup',
      group: [
        {
          title: 'Run 1',
          key: 'sess_setup_run_1',
          dataIndex: 'sess_setup_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'sess_setup_run_2',
          dataIndex: 'sess_setup_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.sess_setup_alert
            })
        }
      ]
    },
    {
      title: 'Set Info',
      key: 'set_info',
      group: [
        {
          title: 'Run 1',
          key: 'set_info_run_1',
          dataIndex: 'set_info_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'set_info_run_2',
          dataIndex: 'set_info_run_2',
          textalign: 'center',
          onCell: (record) => ({
            alert: record.set_info_alert
            })
        }
      ]
    },

    {
      title: 'Stat',
      key: 'stat',
      group: [
        {
          title: 'Run 1',
          key: 'stat_run_1',
          dataIndex: 'stat_run_1',
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'stat_run_2',
          dataIndex: 'stat_run_2',
          width: 100,
          textalign: 'center',
          onCell: (record) => ({
            alert: record.stat_alert
            })
        }
      ]
    },
    {
      title: 'Tcon',
      key: 'tcon',
      group: [
        {
          title: 'Run 1',
          key: 'tcon_run_1',
          dataIndex: 'tcon_run_1',
          width: 100,
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'tcon_run_2',
          dataIndex: 'tcon_run_2',
          width: 100,
          textalign: 'center',
          onCell: (record) => ({
            alert: record.tcon_alert
            })
        }
      ]
    },
    {
      title: 'Tdiscon',
      key: 'tdiscon',
      group: [
        {
          title: 'Run 1',
          key: 'tdiscon_run_1',
          dataIndex: 'tdiscon_run_1',
          width: 100,
          textalign: 'center',
        },
        {
          title: 'Run 2',
          key: 'tdiscon_run_2',
          dataIndex: 'tdiscon_run_2',
          width: 100,
          textalign: 'center',
          onCell: (record) => ({
            alert: record.tdiscon_alert
            })
        }
      ]
    },
  ];

  // grafana stats columns
  const grafanaStatsColumns = [
  {
    title: 'Accordion Name',
    dataIndex: 'accordion_name',
    key: 'accordion_name',
    width: '200px',
  },
  {
    title: 'Panel Name',
    dataIndex: 'panel_name',
    key: 'panel_name',
    width: '200px',
  },
  {
    title: 'Run 1',
    dataIndex: 'run_1',
    key: 'run_1',
    width: '150px',
  },
  {
    title: 'Run 2',
    dataIndex: 'run_2',
    key: 'run_2',
    width: '150px',
  },
];


          
  const [selectedData, setSelectedData] = useState({
    suite: null,
    release1: null,
    runDate1: null,
    commitId1: null,
    release2: null,
    runDate2: null,
    commitId2: null,
  });

  const [selectedComparisonData, setSelectedComparisonData] = useState({
    runConfig:null,
    subdataUID1:null,
    subdataUID2:null
  });

   // ✅ NEW METHOD: Render Empty Comparison Container
  // Place this method BEFORE use effects and after state declarations
  const renderEmptyComparisonContainer = () => {
    return (
      <FlexLayout 
        padding="15px" flexDirection="column"data-testid="empty-comparison-container"
      >
        <div 
          style={{ 
            backgroundColor: "white",
            minHeight: "400px", 
            width: "100%", 
            border: "1px solid #e8e8e8", 
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {isSubmitLoading ? (
            <Loader 
              loading={true} 
              tip="Loading comparison data..."
            />
          ) : !showComparisonTable ? (
            <div 
              style={{ 
                color: "#a0a0a0", 
                textAlign: "center",
                padding: "20px"
              }}
            >
              Select parameters and submit to view comparison
            </div>
          ) : null}
        </div>
      </FlexLayout>
    );
  };
  // Fetch Suites
  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const response = await axios.get("/api/fsct_suites");
        setSuites(response.data);
      } catch (error) {
        console.error("Error fetching suites:", error);
      }
    };
    fetchSuites();
  }, []);

  // Fetch Releases for Suite
  useEffect(() => {
    const fetchReleases = async () => {
      if (selectedData.suite) {
        try {
          const response = await axios.get(`/api/fsct_releases?suite=${selectedData.suite.key}`);
          setReleases1(response.data);
          setReleases2(response.data);
          
          // Reset subsequent dropdowns
          setSelectedData(prev => ({
            ...prev,
            release1: null,
            runDate1: null,
            commitId1: null,
            release2: null,
            runDate2: null,
            commitId2: null
          }));
          
          // Hide comparison table when suite changes
          setShowComparisonTable(false);
        } catch (error) {
          console.error("Error fetching releases:", error);
        }
      }
    };
    fetchReleases();
  }, [selectedData.suite]);

  // Fetch Run Dates for Release 1
  useEffect(() => {
    const fetchRunDates = async () => {
      if (selectedData.suite && selectedData.release1) {
        try {
          const response = await axios.get(`/api/fsct_run_dates?suite=${selectedData.suite.key}&release=${selectedData.release1.key}`);
          setRunDates1(response.data);
          
          // Reset subsequent dropdowns
          setSelectedData(prev => ({
            ...prev,
            runDate1: null,
            commitId1: null
          }));
          
          // Hide comparison table when release changes
          setShowComparisonTable(false);
        } catch (error) {
          console.error("Error fetching run dates:", error);
        }
      }
    };
    fetchRunDates();
  }, [selectedData.suite, selectedData.release1]);

  // Fetch Commit IDs for Run Date 1
  useEffect(() => {
    const fetchCommitIds = async () => {
      if (selectedData.suite && selectedData.release1 && selectedData.runDate1) {
        try {
          const response = await axios.get(`/api/fsct_commit_ids?suite=${selectedData.suite.key}&release=${selectedData.release1.key}&run_date=${selectedData.runDate1.key}`);
          setCommitIds1(response.data);
          
          // Hide comparison table when run date changes
          setShowComparisonTable(false);
        } catch (error) {
          console.error("Error fetching commit IDs:", error);
        }
      }
    };
    fetchCommitIds();
  }, [selectedData.suite, selectedData.release1, selectedData.runDate1]);

  // Fetch Run Dates for Release 2
  useEffect(() => {
    const fetchRunDates2 = async () => {
      if (selectedData.suite && selectedData.release2) {
        try {
          const response = await axios.get(`/api/fsct_run_dates?suite=${selectedData.suite.key}&release=${selectedData.release2.key}`);
          setRunDates2(response.data);
          
          // Reset subsequent dropdowns
          setSelectedData(prev => ({...prev,
            runDate2: null,
            commitId2: null
          }));
          
          // Hide comparison table when release changes
          setShowComparisonTable(false);
        } catch (error) {
          console.error("Error fetching run dates:", error);
        }
      }
    };
    fetchRunDates2();
  }, [selectedData.suite, selectedData.release2]);

  // Fetch Commit IDs for Run Date 2
  useEffect(() => {
    const fetchCommitIds2 = async () => {
      if (selectedData.suite && selectedData.release2 && selectedData.runDate2) {
        try {
          const response = await axios.get(`/api/fsct_commit_ids?suite=${selectedData.suite.key}&release=${selectedData.release2.key}&run_date=${selectedData.runDate2.key}`);
          setCommitIds2(response.data);
          
          // Hide comparison table when run date changes
          setShowComparisonTable(false);
        } catch (error) {
          console.error("Error fetching commit IDs:", error);
        }
      }
    };
    fetchCommitIds2();
  }, [selectedData.suite, selectedData.release2, selectedData.runDate2]);

   // New useEffect to track compareTableData changes
   useEffect(() => {
    console.log('Compare Table Data Updated:', compareTableData)
   }, [compareTableData]);

  const handleToggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  }
   
  const handleDropdownChange = (key, value) => {
    setSelectedData((prev) => {
      //prevent unneccary re-renders if value is the same
      if (prev[key] === value) return prev;
      let updatedData = { ...prev, [key]: value };
  
      // Reset dependent fields when a dropdown is changed
      if (key === "suite") {
        updatedData.release1 = null;
        updatedData.runDate1 = null;
        updatedData.commitId1 = null;
        updatedData.release2 = null;
        updatedData.runDate2 = null;
        updatedData.commitId2 = null;
      } else if (key === "release1") {
        updatedData.runDate1 = null;
        updatedData.commitId1 = null;
      } else if (key === "runDate1") {
        updatedData.commitId1 = null;
      } else if (key === "release2") {
        updatedData.runDate2 = null;
        updatedData.commitId2 = null;
      } else if (key === "runDate2") {
        updatedData.commitId2 = null;
      }
      return updatedData;
    });

     // ✅ Reset and hide second-row dropdowns when 1st row DDs are changed except commit IDs
  if (key !== "commitId1" && key !== "commitId2" && selectedComparisonData.runConfig) {
    setSelectedComparisonData(prev => ({...prev,subdataUID1: null,subdataUID2: null}));
  
    // ✅ Disable second-row dropdowns by resetting their data
    setRunConfigs([]);
    setSubdataUID1([]);
    setSubdataUID2([]);
  
    setShowComparisonTable(false);
    setCompareTableData([]);
    // ✅ Hide the Compare Table
    setShowCompareTable(false);
    setHideSecondRow(true);
    }
  };
  
      const handleComparisonDataDropdownChange = (key, value) => {
        setSelectedComparisonData(prev => {
          let updatedData = {...prev, [key]: value};
          //reset subdata UID 1 & 2 when run config changes
          if (key === 'runConfig') {
            updatedData.subdataUID1 = null;
            updatedData.subdataUID2 = null;
            }
            return updatedData;
            });
            //hide compare table when 2nd row values change
            setShowCompareTable(false);
            setCompareTableData([]);
            };

  const handleSubmit = async () => {
    console.log("Selected Data on Submit:", selectedData);   
    // Check if all required fields are selected
    if (selectedData.suite &&selectedData.release1 &&selectedData.runDate1 &&selectedData.commitId1 &&selectedData.release2 &&selectedData.runDate2 &&selectedData.commitId2) 
      {
      console.log("Submitting data...");
      setIsSubmitLoading(true);
      setDisableSubmitButton(true);

      setSelectedComparisonData({runConfig:null,subdataUID1:null,subdataUID2:null})

      setRunConfigs([]);
      setSubdataUID1([]);
      setSubdataUID2([]);
      setHideSecondRow(true); //new state to hide second row of dropdowns
      //hide the compare table once submit is clicked
      setShowCompareTable(false);
      setCompareTableData([]);
      try {
        // Assuming you would make an API call here to fetch table data
        const response = await axios.post("/api/fsct_submit", selectedData);  // Mock API call
        console.log("Response from submit API:", response.data);

       // ✅ Batch update state to reduce unnecessary re-renders
      setRunConfigs(response.data.run_configs || []);
      setSubdataUID1(response.data.subdata_uid1 || []);
      setSubdataUID2(response.data.subdata_uid2 || []);
      setTableData(response.data);
      setShowComparisonTable(true);  
      } 
       catch (error) {
        console.error("Error submitting data:", error);
      }
      finally{
        setIsSubmitLoading(false);
        setDisableSubmitButton(false);
        setHideSecondRow(false);//show second row of dropdowns only after successful api call
      }
    }  else {
      // Show an error if not all dropdowns are selected
      alert("Please select all dropdown values before submitting");
    }
  };
  //processing functions 
  const processDetailedInfo = (detailedInfo) => {
    console.log("raw detailed Info:", detailedInfo);
    const formattedData = [];
    const alerts = [];
  
    detailedInfo.forEach((item, index) => {
      const rowKey = `detailed-${index}`;
      const rowData = {
        key: rowKey,
        fsct_suite_name: index === 0 ? item.fsct_suite_name : null,
        run_config: index === 0 ? item.run_config : null,
        user_count: item.user_count,
        throughput_run_1: item.throughput?.run_1 || "NA" ,
        throughput_run_2: item.throughput?.run_2 ||"NA" ,
        throughput_diff: item.throughput?.diff ?? null,
        overload_run_1: item.overload?.run_1 || "NA",
        overload_run_2: item.overload?.run_2 ||"NA",
        overload_diff: item.overload?.diff ?? null,
        errors_run_1: item.errors?.run_1 || "NA" ,
        errors_run_2: item.errors?.run_2 || "NA" ,
        errors_diff: item.errors?.diff ?? null,
      };
  
      ['throughput', 'overload', 'errors'].forEach(metric => {
        const diff = Math.abs(item[metric]?.diff || 0);
        if (diff > 10) {
          // rowData[`${metric}_alert`] = {
          const alert= {
            type: Table.TABLE_ALERT.ERROR,
            message: `${metric} shows significant regression`,
            tooltipProps: {OldTooltip:false,placement:'top-start'}
          };
          rowData[`${metric}_alert`] =alert;
          alerts.push({
            column: `${metric}_run_2`,
            row: rowKey,
            ...alert
          });
        } else if (diff > 5) {
          const alert = {
            type: Table.TABLE_ALERT.WARNING,
            message: `${metric} shows concerning difference`,
            tooltipProps: {OldTooltip:false,placement:'top-start'}
          };
          rowData[`${metric}_alert`] = alert;
          alerts.push({
            column: `${metric}_run_2`,
            row: rowKey,
            ...alert
          });
        }
      });
  
      formattedData.push(rowData);
    });
    console.log('final processed detailed info ', formattedData);
    console.log('final detailed table alerts:',alerts);
    return { formattedData, alerts };
  };
  
  const processCounterInfo = (counterInfo) => {
    console.log('raw api counter info data:', counterInfo);
    const counterData = [];
    const counterAlerts = [];
    const operations = ['close', 'create_stat', 'read_stat', 'write_stat', 'ioctl', 'logoff', 'metadata', 
                         'negotiate','other', 'query_dir', 'query_info', 'sess_setup', 'set_info','stat', 'tcon','tdiscon'];
  
    if (!counterInfo || !Array.isArray(counterInfo)) {
      return { counterData, counterAlerts };
    }
  
    counterInfo.forEach((item, index) => {
      const rowKey = `counter-${index}`;
      const counterRowData = {
        key: rowKey,
        fsct_suite_name: index === 0 ? item.fsct_suite_name : null,
        run_config: index === 0 ? item.run_config : null,
        user_count: index % 2 === 0 ? item.user_count : null,
        val_type: item.val_type,
      };
  
      operations.forEach(op => {
        if (item[op]) {
          // counterRowData[`${op}_run_1`] = item[op].run_1 === "NA" ? null : item[op].run_1 || null;
          // counterRowData[`${op}_run_2`] = item[op].run_2 === "NA" ? null : item[op].run_2 || null;
           counterRowData[`${op}_run_1`] = item[op].run_1 || "NA" ;
           counterRowData[`${op}_run_2`] = item[op].run_2 || "NA" ;
          // throughput_run_1: item.throughput?.run_1 || "NA" ,
          // throughput_run_2: item.throughput?.run_2 ||"NA" ,
          counterRowData[`${op}_diff`] = item[op].diff;
  
          if (item[op].diff > 10) {
            counterRowData[`${op}_alert`] = {
              type: Table.TABLE_ALERT.ERROR,
              message: `${op} shows significant regression`,
              tooltipProps: {OldTooltip:false,placement:'top-start'}
            };
            counterAlerts.push({
              column: `${op}_run_2`,
              row: rowKey,
              type: Table.TABLE_ALERT.ERROR,
              message: `${op} shows significant regression`,

            });
          } else if (item[op].diff > 5) {
            counterRowData[`${op}_alert`] = {
              type: Table.TABLE_ALERT.WARNING,
              message: `${op} shows concerning difference`,
              tooltipProps: {OldTooltip:false,placement:'top-start'}
            };
            counterAlerts.push({
              column: `${op}_run_2`,
              row: rowKey,
              type: Table.TABLE_ALERT.WARNING,
              message: `${op} shows concerning difference`,
              tooltipProps: {OldTooltip:false,placement:'top-start'}
            });
          }
        }
      });
  
      counterData.push(counterRowData);
    });
    console.log('final processed counter info data:',counterData);
    console.log('final counter table alerts:',counterAlerts);
    return { counterData, counterAlerts };
  };
  const processGrafanaStats = (grafanaStatsInfo) => {
    if (!grafanaStatsInfo || !Array.isArray(grafanaStatsInfo)) {
      console.warn('Invalid or missing grafana_stats data in API response');
      return { grafanaData: [], alerts: {} };
    }
  
    const grafanaData = grafanaStatsInfo.map((item, index) => {
      return {
        key: `grafana-${index}`,
        accordion_name: item.accordion_name || 'N/A',
        panel_name: item.panel_name || 'N/A',
        run_1: item.run_1 || 'N/A',
        run_2: item.run_2 || 'N/A',
      };
    });
  
    // Generate alerts similar to your other processing functions
    const alerts = {};
    grafanaStatsInfo.forEach((item, index) => {
      const rowKey = `grafana-${index}`;
      // Add alerts based on your comparison logic if needed
      // This is similar to what you might be doing in processDetailedInfo or processCounterInfo
    });
  
    return { grafanaData, alerts };
  };
  
  const FsctSummary = ({ summaryData }) => {
    const [activeMenuPath, setActiveMenuPath] = React.useState(['1','1']);
    if (!summaryData) return null;

    // Define color mapping based on keyword patterns
  const getHighlightColor = (word) => {
    const lowercaseWord = word.toLowerCase();
    if (lowercaseWord.includes('latency')) return '#FF4D4F';
    if (lowercaseWord.includes('users')) return '#00A650';
    if (lowercaseWord.includes('significant change')) return '#FFD700';
    if (lowercaseWord.includes('error')) return '#FF4D4F';
    if (lowercaseWord.includes('high')) return '#FF4D4F';
    if (lowercaseWord.includes('increased')) return '#FF4D4F';
    if (lowercaseWord === 'nothing significant to report') return '#00A650';
    return 'inherit';
  };

  const highlightText = (textData) => {
    if (!textData || !textData.text) return null;
    
    const { text, highlights = [] } = textData;
    // Create a regex that matches any of the highlight words
    const highlightRegex = new RegExp(`(${highlights.join('|')})`, 'gi');
        
    // Split the text and preserve spaces by including them in the split
    const parts = text.split(highlightRegex);
    
    const elements = parts.map((part, index) => {
        // Check if this part matches any highlight word (case-insensitive)
        const isHighlighted = highlights.some(word => 
            part.toLowerCase() === word.toLowerCase()
        );

        if (isHighlighted) {
            return (
                <span 
                    key={`${part}-${index}`}
                    style={{
                        color: getHighlightColor(part),
                        fontWeight: 'bold',
                        // letterSpacing: '0.05em',
                        padding: '0 0.25em',wordSpacing:'0.3em'  // Add padding on both sides of highlighted words
                    }}
                >
                    {part}
                </span>
            );
        }
        
        // For non-highlighted parts, preserve spaces and add word spacing
        return (
            <span 
                key={`${part}-${index}`}
                style={{
                    wordSpacing: '0.25em',
                    // letterSpacing: '0.05em'
                }}
            >
                {part}
            </span>
        );
    });

    return <span style={{ lineHeight: '1.5' }}>{elements}</span>;
};
const handleMenuClick = (info) => {
  setActiveMenuPath(info.keyPath);
};

const renderContent = () => {
  switch (activeMenuPath[1]) {
    case '1':
      return (
        <FlexLayout flexDirection="column" padding="10px">
          <UnorderedList 
            data={summaryData.detailed_info?.map(item => highlightText(item)) || []} 
            data-test-id="detailed-summary" 
          />
          
        </FlexLayout>
      );
    case '2':
      return (
        <FlexLayout flexDirection="column" padding="10px">
          <UnorderedList 
            data={summaryData.counter_info?.map(item => highlightText(item)) || []} 
            data-test-id="counter-summary" 
          />         
        </FlexLayout>
      );
    default:
      return null;
  }
};

return (
  <FlexLayout
    flexDirection="column"
    style={{
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      border: '1px solid #e8e8e8',
      borderRadius: '4px',
      backgroundColor: 'white',
      overflow: 'hidden',
    }}
  >
    {/* Header Section */}
    <FlexLayout
      flexDirection="column"
      style={{
        padding: '5px',
        borderBottom: '1px solid #e8e8e8',
        // backgroundColor: '#fafafa'
      }}
    >
      <StackingLayout padding ="0px" spacing='spacing-0'>
      <Title size="h3">FSCT Summary</Title>
      <Separator spacing="spacing-10px" separator={<DotIcon size="small" />}>
        <TextLabel>Detailed Info</TextLabel>
        <TextLabel>Counter Info</TextLabel>
      </Separator>
      </StackingLayout>
    </FlexLayout>

    {/* Content Section */}
    <FlexLayout>
      <Menu
        itemSpacing="10px"
        padding="10px-0px"
        activeKeyPath={activeMenuPath}
        onClick={handleMenuClick}
        style={{ 
          width: '240px', 
          minWidth: '240px',
          borderRight: '1px solid #e8e8e8',
          height:'100%'
        }}
        role={Menu.MenuRole.MENUBAR}>
        <MenuGroup key="1">
    <MenuItem key="1" style={{height:'72px',lineHeight:'72px'}} > Detailed Summary </MenuItem>
    <MenuItem key="2" style={{height:'72px',lineHeight:'72px'}}>Counter Summary</MenuItem>
  </MenuGroup>
</Menu>

      <FlexItem 
        flexGrow="1" 
        style={{ 
          maxHeight: '300px',
          overflowY: 'auto',
          height:'100%'
          // padding: '20px'
        }}
      >
        {renderContent()}
      </FlexItem>
    </FlexLayout>
  </FlexLayout>
);
};
  const handleCompare = async () => {
    setHasInitiatedCompare(true);
    setIsCompareLoading(true);

    setTimeout(async () => {  // Ensure latest state updates before validation
      console.log("Comparing with values:", selectedComparisonData);
  
      if (!selectedComparisonData.runConfig || 
          !selectedComparisonData.subdataUID1 || 
          !selectedComparisonData.subdataUID2) {
        alert("Please select : runconfig, subdata UID 1 and subdata 2");
        setIsCompareLoading(false);
        return;
      }
      
      try{
        const comparisonPayload = {
            suite: selectedData.suite.key,
            release1: selectedData.release1.key,
            release2: selectedData.release2.key,
            runDate1: selectedData.runDate1.key,
            runDate2: selectedData.runDate2.key,
            commitId1: selectedData.commitId1.key,
            commitId2: selectedData.commitId2.key,
            runConfig: selectedComparisonData.runConfig?.key,
            subdataUID1: selectedComparisonData.subdataUID1?.key,  
            subdataUID2: selectedComparisonData.subdataUID2?.key,  
      };
      console.log('comparison payload:',comparisonPayload);
  
      const response = await axios.post('/api/fsct_compare', comparisonPayload);
      console.log('comparison API response:', response.data);
      
      // Validate response data
    if (!response.data?.detailed_info || !Array.isArray(response.data.detailed_info)) {
      throw new Error('Invalid response format: Missing detailed_info array');
    }
    const middleIndex = Math.floor(response.data.detailed_info.length/2);
    const { formattedData:detailedData, alerts:detailedAlerts } = processDetailedInfo(response.data.detailed_info);
    const { counterData, counterAlerts } = processCounterInfo(response.data.counter_info);
    // Add processing for Grafana stats data
    const { grafanaData, alerts:grafanaAlerts } = processGrafanaStats(response.data.grafana_stats);
    console.log("Processed Grafana Stats Table Data:", grafanaData);
    console.log("Generated Grafana Stats Alerts:", grafanaAlerts);

    console.log("Processed Detailed Info Table Data:", detailedData); // ✅ Log formatted table data
    console.log("Generated Detailed Table Alerts:", detailedAlerts); // ✅ Log generated alerts
    console.log("Processed Counter Info Table Data:", counterData); // ✅ Log counter table data
    console.log("Generated Counter Table Alerts:", counterAlerts); // ✅ Log counter alerts
        setTableCellAlerts(detailedAlerts);
        setCounterInfoTableAlerts(counterAlerts);
        setCompareTableData(detailedData);
        setCounterInfoData(counterData);
        setGrafanaStatsData(grafanaData);
        setGrafanaStatsAlerts(grafanaAlerts);
        setSummaryData(response.data.summary);
        setShowCompareTable(true);
    // Then set the table data
    console.log('Setting table data:', detailedData);
    } catch (error) {
      console.error('Comparison API error:', error); 
      alert(error.message || 'Failed to fetch comparison data');
    } finally {
      setIsCompareLoading(false);
    }
  })
};
  const renderTableContainer = () => {
    if (!hasInitiatedCompare) {
      return (
        <FlexLayout padding="15px" flexDirection="column" >
          <div style={{ 
            backgroundColor: "white",
            minHeight: "400px",
            width: "100%",
            border: "1px solid #e8e8e8",
            // margin:'0 auto',
            borderRadius: "4px"
          }}></div>
        </FlexLayout>
      );
    }

    if (isCompareLoading) {
      return (
        <FlexLayout padding="15px" flexDirection="column" style={{width:'100%'}}>
          <Loader loading={true} tip="Loading comparison results...">
            <ContainerLayout backgroundColor="white">
              <div style={{ 
                minHeight: "400px",width: "100%",display: "flex",
                justifyContent: "center", alignItems: "center",border: "1px solid #e8e8e8",borderRadius: "4px"
              }}></div>
            </ContainerLayout>
          </Loader>
        </FlexLayout>
      );
    }

    if (showCompareTable) {
      return (
        <div style={{width:'100%',overflow:'hidden'}}>
        <FlexLayout flexDirection="column" padding='20px' style={{width:'100%'}} >
          <FlexLayout style={{overflowX:'auto'}}><FsctSummary summaryData={summaryData}/></FlexLayout>
          <Accordion
            title="FSCT Detailed Info Comparitor"
            expanded={expandedAccordion === 1}
            onToggleClick={() => handleToggleAccordion(1)}
          >
            <FlexLayout /*padding='10px'*/ flexDirection="column" style={{width:'100%',overflow:'hidden'}} >
              <Table
                columns={compareColumns}
                dataSource={compareTableData}
                cellAlerts={tableCellAlerts}
                structure={{bodyMaxHeight: '500px',width:'100%'}}
                showCustomScrollbar={true}
              />
            </FlexLayout>
          </Accordion>

          <Divider/>
          
          <Accordion
            title="FSCT Counter Info Comparitor"
            expanded={expandedAccordion === 2}
            onToggleClick={() => handleToggleAccordion(2)}
          >

            <FlexLayout /*padding='15px'*/ flexDirection="column" style={{width:'100%',overflow:'hidden',maxWidth:'1400px'}}>
              <Table
                columns={counterInfoColumns}
                dataSource={counterInfoData}
                loading={isCompareLoading}
                style={{ marginTop: '20px' }}
                cellAlerts={counterInfoTableAlerts}
                showCustomScrollbar={true}
                structure={{
                  bodyMaxHeight: '400px',width:'100%',
                  columnWidths: {
                    fsct_suite_name: '150px',
                    run_config: '160px',
                    user_count: '150px',
                    val_type: '150px',
                    close_run_1: '120px',
                    close_run_2: '120px',
                    create_stat_run_1: '120px',
                    create_stat_run_2: '120px',
                    read_stat_run_1: '120px',
                    read_stat_run_2: '120px',
                    write_stat_run_1: '120px',
                    write_stat_run_2: '120px',
                    ioctl_run_1: '120px',
                    ioctl_run_2: '120px',
                    logoff_run_1: '120px',
                    logoff_run_2: '120px',
                    metadata_run_1: '120px',
                    metadata_run_2: '120px',
                    negotiate_run_1: '120px',
                    negotiate_run_2: '120px',
                    other_run_1: '120px',
                    other_run_2: '120px',
                    query_dir_run_1: '120px',
                    query_dir_run_2: '120px',
                    query_info_run_1: '120px',
                    query_info_run_2: '120px',
                    sess_setup_run_1: '120px',
                    sess_setup_run_2: '120px',
                    set_info_run_1: '120px',
                    set_info_run_2: '120px',
                    stat_run_1: '120px',
                    stat_run_2: '120px',
                    tcon_run_1: '120px',
                    tcon_run_2: '120px',
                    tdiscon_run_1: '120px',
                    tdiscon_run_2: '120px',
                  },
                }}
                wrapperProps={{
                  'data-test-id': 'counter-info-table',
                }}
              />
            </FlexLayout>
          </Accordion>
          <Divider/>
        s
        {/* New Grafana Stats Accordion */}
          <Accordion
            title="FSCT Grafana Stats Summary"
            expanded={expandedAccordion === 3}
            onToggleClick={() => handleToggleAccordion(3)}
          >
            <FlexLayout flexDirection="column" style={{width:'100%',overflow:'hidden',maxWidth:'1400px'}}>
              <Table
                columns={grafanaStatsColumns}
                dataSource={grafanaStatsData}
                loading={isCompareLoading}
                style={{ marginTop: '20px' }}
                cellAlerts={grafanaStatsAlerts}
                showCustomScrollbar={true}
                structure={{
                  bodyMaxHeight: '400px',
                  width:'100%',
                  columnWidths: {
                    accordion_name: '200px',
                    panel_name: '200px',
                    run_1: '150px',
                    run_2: '150px',
                  },
                }}
                wrapperProps={{
                  'data-test-id': 'grafana-stats-table',
                }}
              />
            </FlexLayout>
          </Accordion>
        </FlexLayout>
      </div>
    );
}
    return null;
  };
  
  return (
    
    <FlexLayout padding="20px" flexDirection="column">
      <FlexLayout style={{display: 'flex', gap: '10px', marginBottom: '5px'}}>
        <FormItemSelect
          placeholder="Suite name"
          rowsData={suites}
          selectedRow={selectedData.suite}
          onSelectedChange={(value) => handleDropdownChange('suite', value)}
        />
        
        <FormItemSelect
          placeholder="AFS Release 1"
          rowsData={releases1}
          selectedRow={selectedData.release1}
          onSelectedChange={(value) => handleDropdownChange('release1', value)}
          disabled={!selectedData.suite}
        />
        
        <FormItemSelect
          placeholder="Run Date 1"
          rowsData={runDates1}
          selectedRow={selectedData.runDate1}
          onSelectedChange={(value) => handleDropdownChange('runDate1', value)}
          disabled={!selectedData.release1}
        />
        
        <FormItemSelect
          placeholder="Commit ID 1"
          rowsData={commitIds1}
          selectedRow={selectedData.commitId1}
          onSelectedChange={(value) => handleDropdownChange('commitId1', value)}
          disabled={!selectedData.runDate1}
        />
        
        <FormItemSelect
          placeholder="AFS Release 2"
          rowsData={releases2}
          selectedRow={selectedData.release2}
          onSelectedChange={(value) => handleDropdownChange('release2', value)}
          disabled={!selectedData.suite}
        />
        
        <FormItemSelect
          placeholder="Run Date 2"
          rowsData={runDates2}
          selectedRow={selectedData.runDate2}
          onSelectedChange={(value) => handleDropdownChange('runDate2', value)}
          disabled={!selectedData.release2}
        />
        
        <FormItemSelect
          placeholder="Commit ID 2"
          rowsData={commitIds2}
          selectedRow={selectedData.commitId2}
          onSelectedChange={(value) => handleDropdownChange('commitId2', value)}
          disabled={!selectedData.runDate2}
        />
       

      <Button onClick={handleSubmit}
      
       disabled={disableSubmitbutton}>
        Submit</Button>
      </FlexLayout>
      
      
       {/* First comparison table with loader */}
           {isSubmitLoading ? (
              <Loader 
                loading={true} 
                tip="Loading comparison data..."
                data-test-id="submit-loader"
              >
                <ContainerLayout backgroundColor="white">
                  {/*empty container while loading*/}
                  <div style={{minHeight: '200px'}}
                  />
                </ContainerLayout>
              </Loader>
              ) : (
      
showComparisonTable && ( 
      <FsctComparisonTable
      suite={selectedData.suite}
      release1={selectedData.release1}
      release2={selectedData.release2}
      runDate1={selectedData.runDate1}
      runDate2={selectedData.runDate2}
      commitId1={selectedData.commitId1}
      commitId2={selectedData.commitId2}
      selectedData={selectedData}
      tableData={ tabledata }
       />
        )
        )}
        {/* 🌟 NEW: Always-visible empty comparison container */}
      {!isSubmitLoading && !showComparisonTable && renderEmptyComparisonContainer()}

       
       {!isSubmitLoading && !hideSecondRow && showComparisonTable &&(
       <FlexLayout style={{display: 'flex', gap: '10px', marginTop: '20px',alignItems:'center',}}>
        <FormItemSelect
          placeholder="Run Config"
          rowsData={runConfigs}
          selectedRow={selectedComparisonData.runConfig}
          onSelectedChange={(value) => handleComparisonDataDropdownChange('runConfig', value)}
          disabled={!showComparisonTable}  
        />
        
        <FormItemSelect
          placeholder="Subdata UID 1"
          rowsData={subdataUID1}
          selectedRow={selectedComparisonData.subdataUID1}
          onSelectedChange={(value) => handleComparisonDataDropdownChange('subdataUID1', value)}
          disabled={!selectedComparisonData.runConfig}
        />
        
        <FormItemSelect
          placeholder="Subdata UID 2"
          rowsData={subdataUID2}
          selectedRow={selectedComparisonData.subdataUID2}
          onSelectedChange={(value) => handleComparisonDataDropdownChange('subdataUID2', value)}
          disabled={!selectedComparisonData.runConfig}
        />

<Button onClick={handleCompare} disabled={disableComparebutton}>Compare</Button>
</FlexLayout>
)}
       <FlexLayout>{renderTableContainer()}</FlexLayout>
        
      </FlexLayout>
  );  
}

export default FsctCascadingDropdowns;