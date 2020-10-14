import React, { Component } from "react";
// eslint-disable-next-line
import { Table, Button, Row, Col, Upload, Icon, Popconfirm, Tooltip} from "antd";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "../utils/editable";
import $ from "jquery";


export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      
      errorMessage: null,
      columns:   [
        {
          title: "Unique Numbers",
          dataIndex: "uniqueNumbers",
          editable: true,
        },
        {
          title: "First Name",
          dataIndex: "firstName",
          editable: true,
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
          editable: true,
        },
        {
          title: "Total Match Played",
          dataIndex: "totalMatchPlayed",
          editable: true,
        },
        {
          title: "IPL Captain",
          dataIndex: "iplcaptain",
          editable: true,
        },
        {
          title: "Scenario",
          dataIndex: "scenario",
          editable: true,
        },
        
        {
          title: "",
          dataIndex: "action",
          render: (text, record) =>
            this.state.rows.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <Icon
                  type="delete"
                  theme="filled"
                  style={{ color: "red", fontSize: "20px" }}
                />
              </Popconfirm>
            ) : null
        }
      ],
    };
  }
  handleSave = (row) => {
    const newData = [...this.state.rows];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ rows: newData });
  };
  checkFile(file) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
        "";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
  }
  fileHandler = (fileList) => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!",
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          ""
      )
    ) {
      this.setState({
        errorMessage: "",
      });
      return false;
    }
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        // eslint-disable-next-line
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              key: index,
              uniqueNumbers: row[0],
              firstName: row[1],
              lastName: row[2],
              totalMatchPlayed: row[3],
              iplcaptain: row[4],
              scenario: row[5]
            });
          }
        });
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!",
          });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null,
          });
        }
      }
    });
    return false;
  };
  handleSubmit = async () => {
    console.log("submitting: ", this.state.rows);

  };
  handleDelete = (key) => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter((item) => item.key !== key) });
  };
  handleAdd = () => {
    const { count, rows } = this.state;
    const newData = {
      key: count
    };
    this.setState({
      rows: [newData, ...rows],
      count: count,
    });
  };
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    $("#myInput").on("keyup", function() {
      var inputValue = $(this).val().toLowerCase();
      // eslint-disable-next-line
      $("#table tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1)
      });
    });

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Simple tooltip
      </Tooltip>
    );
    return (
      
      <>   
        
        <Row gutter={16} justify="space-between">
          <Col
            span={8}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
            }}
          >
          </Col>
          <Col
            span={8}
            align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {this.state.rows.length > 0 && (
              <>
                <Button className="m1"
                  onClick={this.handleAdd}
                  size="large"
                  type="info"
                  style={{ marginBottom: 16 }}
                  
                >
                  <Icon type="plus" />
                  Add a Pod
                </Button>{" "}
              </>
            )}
          </Col>
        </Row>

        <div className="e1">
          <div className="e2">
          
            <Upload
              name="file"
              beforeUpload={this.fileHandler}
              onRemove={() => this.setState({ rows: [] })}
              multiple={false}
            >
              
              <Button>
                <Icon type="upload" /> Click to Upload Excel File
                
              </Button>    
                       
            </Upload>
            {/* <Button variant="dark" id="summary-button">Summary View</Button>{' '} */}
           
            
          </div>
              
        </div>

        <div className="for-search">
        <p className="for-search-text">Type Unique no, First Name, Last Name, Total Match Played IPL Captain, Scenario search in the box.</p>
        <input className="form-control" id="myInput" type="text" placeholder="Search.." />
      </div>



        <div style={{ marginTop: 20 }}>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
            overlay={renderTooltip}
            id="table"
          />
          
        </div>
        <footer>
          <div className="footer-wrap">
              Demo Data
          </div>
        </footer>
      </>
    );
  }
}
