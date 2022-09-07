import React, { useState, useEffect, useRef } from "react";
import DataGrid, {
    Column,
    Editing,
    Popup as DataGridPopup,
    
    Selection, Button as ActionButton,
} from "devextreme-react/data-grid";
import {
    Item,
    
    PatternRule,
    Lookup,
    SearchPanel,
    RequiredRule as RequiredRuleForm,
} from "devextreme-react/form";
import { TreeList } from "devextreme-react";
import List from "devextreme-react/list";
import ArrayStore from "devextreme/data/array_store";
import { Template } from "devextreme-react/core/template";
import { Popup } from "devextreme-react/popup";
import docImage from "../../../assets/imgs/law-component-document.svg";
import notify from "devextreme/ui/notify";
import FileUploader from "devextreme-react/file-uploader";
import OgLoader from "../../../util/OgLoader";
import crudService from "../../../services/api/news";
import DataSource from 'devextreme/data/data_source';
import _ from "lodash";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/data-grid";
import ScrollView from "devextreme-react/scroll-view";
import OrganizationService from "../../../services/api/organization";
import lawServices from "../../../services/api/law";
import { customers } from './data.js'
import DropDownButton from 'devextreme-react/drop-down-button'

import Form, {
    ButtonItem,
    GroupItem,
    Item as FormItem,
    Label,
    RequiredRule,
  } from "devextreme-react/form";
  import SelectBox from 'devextreme-react/select-box';
  import './data2.js';
  import TextArea from 'devextreme-react/text-area';
  import HtmlEditor, {
    MediaResizing,
    Toolbar,
  } from "devextreme-react/html-editor";
  import { CheckBox } from 'devextreme-react/check-box';
  import TextBox from 'devextreme-react/text-box';
  import {Button as DevExtremeButton} from "devextreme-react/button";
  
  let markup = "";

//Main High Order Component for landing section news text context, CRUD control dashboard.
//add dependency array on row ID change
const CrudGeneralInfo = () => {
    const [crudData, setCrudData] = useState([]);
    const [popUpModal, setPopUpModal] = useState(false);
    const [currentSelectedRow, setCurrentSelectedRow] = useState({});
    const [popUpId, setPopUpId] = useState(0);
    const [childData, setChildData] = useState([]);
    const [branchListData, setBranchData] = useState([]);
    const [parentData, setParentData] = useState([]);
    const [policyDesc, setPolicyDesc] = useState([]);

    //Data Store object uses complex state management of dx.
    //description data table doesnt have field for state_structure_id, led to requirement of reverse mapping.
    const dataSourceOptions = {
        store: childData
    };


    //datasource store implementation is for JQUERY based frameworks not for react. Usage will be duplication of axios library, plus complex token management
    const dataSource = new DataSource({
        // ...
        // DataSource is configured here
        // ...
    });

    const getCrudData = async () => {
        try {
            const payload = await crudService.getCrudData();
            setCrudData(payload.data);
            console.log(payload);
        }
        catch (error) {
            notify(error);
        }
    };
    //datasource store data shaping for treelist branches
    //same format for each joint query
    // use data source option to inject update remove functionalities.
    const getRowDetail = async (id) => {
        const payload = await crudService.getCrudDetail(id);
        console.log('payloadpayloadpayloadpayloadpayloadpayloadpayloadv -> ');
        console.table(payload.data);
        console.log('<- payloadpayloadpayloadpayloadpayloadpayloadpayloadv ');
        const headTemp = await addHeadId(payload.data);
        const childTemp = await filterBranchJSON(payload.data);
        const treeListDataStructure = _.union(headTemp,childTemp);
        setChildData(treeListDataStructure);
        setCurrentSelectedRow(payload);
        console.log(treeListDataStructure);
        console.log('childata -> ')
        console.table(treeListDataStructure);
    };

    // const getRowDetail = async (id) => {
    //     const payload = await crudService.getCrudDetail(id);
    //     setChildData(payload.data);
    //     await filterBranchJSON(payload.data);
    //     console.log("Suspense API is called row details...");
    //     console.log(payload);
    //     console.log("Row details fetch has ended");
    //     console.log("Child State :" + childData);
    //     console.log("nested Object Debug : " + JSON.stringify(payload.data[0].attribute_details));
    // };

    //add parent id in child Data
    const addHeadId = async (treeListHeadData) => {

        for(let i =0; i < treeListHeadData.length; i ++)
        {
            treeListHeadData[i].sattr_id= 0;
            console.log(treeListHeadData[i]);
        }

        return treeListHeadData;
        // setChildData(treeListHeadData);
        // console.table(treeListHeadData);
    }

    //function to flatten json into datasource mappable format
    const filterBranchJSON = async (payload) => {
        let lstat = [];
        for (let i = 0; i < payload.length; i++) {
            if(payload[i].attribute_details.length !== 0)
            {
                lstat.push(...payload[i].attribute_details);
            }
            
        }

        for (let i = 0; i < lstat.length; i++)
        {
            lstat[i].treelist_parent_id = lstat[i].sattr_id;
        }
        
        return lstat;
        //setParentData(payload);

        //should be moved to backend
        //setBranchData(JSON.stringify(lstat));

        //policy_desc datasource
        //setBranchData(lstat);
        //console.table(lstat);
    }
    const onClickEdit = async (e) => {
        //setPopUpId(e.data.currentSelectedRow.id);
        let response = getRowDetail(e.data.id);
        console.log("Anchor click event triggered:...");
        console.log(response);
        console.log(typeof e.data);
        console.log(e.data);
        setCurrentSelectedRow(e.data);
        console.log("type of state is : " + typeof currentSelectedRow);
        console.log("Current selected state is : " + JSON.stringify(currentSelectedRow));
        console.table(dataSourceOptions);
        setPopUpModal(true);
    }



    useEffect(async () => {
        try {
            console.log('useEffect Called...');
            await getCrudData();
        } catch (error) {
            notify(error);
        }
    }, []);



    const renderCell = (e) => {
        return (
            <a
                onClick={() => {
                    //setPopUpId(e.data.currentSelectedRow.id);
                    console.log("idddd : " + e.data.id);
                    getRowDetail(e.data.id).then(r => setCurrentSelectedRow(e.data));

                    console.log("type of state is : " + typeof currentSelectedRow);
                    console.log("Current selected state is : " + JSON.stringify(currentSelectedRow));
                    setPopUpModal(true);
                }}
            >
               Оруулах
            </a>
            
        );
    };
    // const renderCel = (e) => {
    //     return (
    //         <a
    //             onClick={() => {
    //                 //setPopUpId(e.data.currentSelectedRow.id);
    //                 console.log("idddd : " + e.data.id);
    //                 getRowDetail(e.data.id).then(r => setCurrentSelectedRow(e.data));

    //                 console.log("type of state is : " + typeof currentSelectedRow);
    //                 console.log("Current selected state is : " + JSON.stringify(currentSelectedRow));
    //                 setPopUpModal(true);
    //             }}
    //         >
    //             Засах
    //         </a>
            
    //     );
    // };

    const onShowingTreelist = () => {
        console.log("popup onshown event is triggered...");
        console.log("type of state is : " + typeof currentSelectedRow);
        console.log("Current selected state is : " + JSON.stringify(currentSelectedRow));
        console.log("showed");
    };

    function updateRow(e) {
        console.log("row update triggered");
        console.log(e);
        console.log(e.key);
        console.log(e.newData);
        try {
            // setLoadingVisible(true);
            const {res} = crudService.updatePolicyDesc(e.key,e.newData);
            console.log("update api is called.");
            console.log(res);
            notify("Амжилттай өөрчиллөө!", "success", 5000);
            // setLoadingVisible(false);
        } catch (e) {
            //setLoadingVisible(false);
            notify("Өөрчилөлт хийхэд алдаа гарлаа!", "warning", 5000);
        }
    }
    const onRowUpdated = async (e) => {
        console.log("onRowUpdated");
        e.cancelEditData();
        console.log(e);
        console.log(e.key);
        console.log(e.newData);

        // try {
        //    // setLoadingVisible(true);
        //     const {res} = await OrganizationService.updateOrganizationSettingList(data.data);
        //     notify("Амжилттай өөрчиллөө!", "success", 5000);
        //
        //    // setLoadingVisible(false);
        // } catch (e) {
        //     //setLoadingVisible(false);
        //     notify("Өөрчилөлт хийхэд алдаа гарлаа!", "warning", 5000);
        //}

    };
    const hideInfo = () => {
        console.log("popup hide event is triggered...");
        setPopUpModal(false);
        console.log("selected row state is : " + currentSelectedRow);
        console.log("selected child data is : " + childData);
        setCurrentSelectedRow({});
        setChildData([]);
        console.log("popup hide even last line");
        console.log("branch state printing : " + branchListData);
    };
    const htmlEditorRef = useRef();
    const htmlEditorRef1 = useRef();
    const [img, setImg] = useState([]);
    const [newsObj] = useState({});
    const [visible, setVisible] = useState(false);
    const formRef = useRef(null);
    const [isLoading, setIsLoading]= useState(false)
    const [addNewsFormToggler, setAddNewsFormToggler]= useState(false)
    const [Toggler, setToggler]= useState(false)
  
  
    const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  
    const fontValues = [
      "Arial",
      "Courier New",
      "Georgia",
      "Impact",
      "Lucida Console",
      "Tahoma",
      "Times New Roman",
      "Verdana",
    ];
  
    const sizeOptions = { placeholder: "Хэмжээ" };
  
    const fontOptions = { placeholder: "Фонт" };

    const onEditorPreparing = (e) => {
        if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
            e.cancel = true;
        }
        console.log(e.row);
    };
   
    const titleOptions = { placeholder: "Нийтлэлийн гарчиг" };
    const textOptions = { height: 90, placeholder: "Нийтлэлийн тайлбар..." };
    const buttonOptions = {
        
        method: "submit",
        type: "success",
        useSubmitBehavior: true,
      };
      const consoleChange = (e) => {
        htmlEditorRef.current = e.value;
        markup = e.value;
      };

      const buttonDropDownOptions = { width: 230 };
      const simpleProducts = [
        'HD Video Player',
        'SuperHD Video Player',
        'SuperPlasma 50',
        'SuperLED 50',
        'SuperLED 42',
        'SuperLCD 55',
        'SuperLCD 42',
        'SuperPlasma 65',
        'SuperLCD 70',
        'Projector Plus',
        'Projector PlusHT',
        'ExcelRemote IR',
        'ExcelRemote BT',
        'ExcelRemote IP',
      ];
        const cleanForm = async (result) => {
    formRef.current.instance.resetValues();
    // htmlEditorRef.current.instance.resetValues();
    return notify(result.message, "success", 4000);
  };

      const submitHandler = async (e) => {
        e.preventDefault();
        const data= new FormData();
        
        setVisible(true);
        if (img.length === 0) return notify("Зураг оруулна уу!", "warning", 3000);

        try {
          setVisible(false);
        } catch (e) {
          setVisible(false);
          console.log(e, " - > error");
          return notify("Хадгалах үйлдэл амжилтгүй боллоо!", "warning", 4000);
        }
      };
    
      const consoleChange1 = (e) => {
        htmlEditorRef1.current = e.value;
        markup = e.value;
      };
      


    return (
        

        <div>
            <DataGrid dataSource={customers} showBorders={false}>
            <Editing
                                    allowUpdating={true}
                                    allowDeleting={true}
                                    mode="row" />
                <Column dataField="ID" caption="Д/д" width='40'
                
            
                ></Column>
                <Column caption="Яам" datafield='CompanyNam' width='200' ></Column>
                <Column caption="Байгууллагын нэр" datafield='Addres' width='300' ></Column>
                <Column caption="Мэдээлэл оруулсан огноо" dataType='date'></Column>
                <Column caption="Үйлдэл" type="buttons">
                                    <Button name="edi" text="Оруулах"  render={renderCell}/>
                                    <Button name="delet" text="Засах" onClick={() => setAddNewsFormToggler(true)}/>
                                </Column>
                {/* <Template name="customCellTemplat" render={renderCel} /> */}
            </DataGrid>
            
<Popup 
visible={addNewsFormToggler} 
closeOnOutsideClick={true} 
          dragEnabled={false}
          showCloseButton={false}
          showTitle={true}

onHiding={()=>setAddNewsFormToggler(false)}>

        <ScrollView height="100%" width="100%">
        
        <h1 className="html-editor-title">Ерөнхий мэдээлэл</h1>
        <div className="dx-fieldset">
            <div className="dx-field">
            <div className="dx-field-label">Яам сонгох:</div>
            <div className="dx-field-value">
              <SelectBox items={simpleProducts}
                placeholder="ХЗДХЯ"
                showClearButton={true} />
            </div>
          </div>
          </div>
          <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Ерөнхий газар:</div>
            <div className="dx-field-value">
              <SelectBox items={simpleProducts}
                placeholder="ЦЕГ"
                showClearButton={true} />
            </div>
          </div>
          </div>
          <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Байгууллага:</div>
            <div className="dx-field-value">
              <SelectBox items={simpleProducts}
                placeholder="Архангай аймгийн цагдаагийн газар"
                showClearButton={true} />
            </div>
          </div>
          </div>
          <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea  height={200} className="dx-field-value" defaultValue="bla bla" />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea height={200} className="dx-field-value" defaultValue="bla bla" />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea height={200} className="dx-field-value" defaultValue="bla blass" />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea height={200} className="dx-field-value" defaultValue="424 N Main St." />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
        <div className="dx-field">

            <div className="dx-field-label">Оруулсан файлууд:</div>
         
            <DataGrid dataSource={customers} showBorders={false}
            onEditingStart=""
          onInitNewRow=""
          onRowInserting=""
          onRowInserted=""
          onRowUpdating=""
          onRowUpdated=""
          onRowRemoving=""
          onRowRemoved=""
          onSaving=""
          onSaved=""
          onEditCanceling=""
          onEditCanceled=""
            >
            <Editing
              allowUpdating={true}
              allowDeleting={true}
              mode="row"
              texts={{
               confirmDeleteMessage: 'Энэ мэдээллийг устгах уу?',
               confirmDeleteTitle: 'Баталгаажуулах',
              deleteRow: 'Устгах',
              editRow: 'Өөрчлөх',
              saveRowChanges: 'Хадгалах',
              undeleteRow: 'Буцаах',
              validationCanceChanges: 'Баталгаажуулах болих',
                                    }}
                                     />
                <Column caption="Файлын нэр" datafield='Websit'></Column>
                <Column caption="Файлын төрөл" dataType='Websit'></Column>
                <Column caption="Үйлдэл" type="buttons">
                                    <Button  text="Устгах" name='delete' />
                                    <Button  text="Өөрчлөх" onClick={() => setToggler(true)}/>
                                </Column>
                {/* <Template name="customCellTemplat" render={renderCel} /> */}
            </DataGrid>
            </div>
            </div>
            
          

        </ScrollView>

      </Popup>
      <Popup 
visible={Toggler} 
closeOnOutsideClick={true} 
onHiding={()=>setToggler(false)}
width={300}
          height={300}>

        <ScrollView height="80%" width="100%">
        
        <div className="row">
            <div className="dx-field-label">Файл хуулах:</div>
            
            <FileUploader
            multiple=""
            accept=""
            uploadMode=""
            uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
            onValueChanged="" />
           
            </div>
            <div className="row">
            <DevExtremeButton 
                  width={120}
                  text="Хадгалах"
                  type="normal"
                  buttonOptions={buttonOptions}
                  stylingMode="contained"
                  style={{position: 'absolute',}}
                />
            
            </div>
        </ScrollView>

      </Popup>
      //oruulah
      <Popup
          visible={popUpModal}
          onShowing={onShowingTreelist}
          onHiding={hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showCloseButton={false}
          showTitle={true}
          title="Дэлгэрэнгүй мэдээлэл"
      >
        <ScrollView height="97%" width="100%">
          <form onSubmit={submitHandler}>
            <h1 className="html-editor-title">Ерөнхий мэдээлэл</h1>
            <div className="dx-field">
              <div className="dx-field-label">Яам сонгох:</div>
              <div className="dx-field-value">
                <SelectBox items={simpleProducts}
                  placeholder="Яам сонгох"
                  showClearButton={true} />
              </div>
            </div>

            <div className="dx-field">
              <div className="dx-field-label">Ерөнхий газар:</div>
              <div className="dx-field-value">
                <SelectBox items={simpleProducts}
                  placeholder="Ерөнхий газар сонгох"
                  showClearButton={true} />
              </div>
            </div>
          
            <div className="dx-field">
              <div className="dx-field-label">Байгууллага:</div>
              <div className="dx-field-value">
                <SelectBox items={simpleProducts}
                  placeholder="Байгууллага сонгох"
                  showClearButton={true} />
              </div>
            </div>
            <div className="row">
              <div className="dx-field-label">Бид юу хийдэг вэ?:</div>
              <div className="dx-field-value">
                <HtmlEditor
                      onValueChanged={consoleChange1}
                      ref={htmlEditorRef}
                  >
                    <MediaResizing enabled={true} />
                    <Toolbar>
                      <Item name="undo" />
                      <Item name="separator" />
                      <Item name="redo" />
                      <Item name="separator" />
                      <Item
                          name="size"
                          acceptedValues={sizeValues}
                          options={sizeOptions}
                      />
                      <Item name="separator" />
                      <Item
                          name="font"
                          acceptedValues={fontValues}
                          options={fontOptions}
                      />
                      <Item name="separator" />
                      <Item name="bold" />
                      <Item name="italic" />
                      <Item name="strike" />
                      <Item name="underline" />
                      <Item name="separator" />
                      <Item name="alignLeft" />
                      <Item name="alignCenter" />
                      <Item name="alignRight" />
                      <Item name="alignJustify" />
                      <Item name="separator" />
                      <Item name="orderedList" />
                      <Item name="bulletList" />
                      <Item name="separator" />
                      <Item name="separator" />
                      <Item name="link" />
                      <Item name="separator" />
                    </Toolbar>
                  </HtmlEditor>
                </div>
              </div>
            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>

            <div className="row">
              <div className="dx-field-label">Бид хэн бэ?:</div>
              <div className="dx-field-value">
                <HtmlEditor
                      onValueChanged={consoleChange}
                      ref={htmlEditorRef}
                  >
                    <MediaResizing enabled={true} />
                    <Toolbar>
                      <Item name="undo" />
                      <Item name="separator" />
                      <Item name="redo" />
                      <Item name="separator" />
                      <Item
                          name="size"
                          acceptedValues={sizeValues}
                          options={sizeOptions}
                      />
                      <Item name="separator" />
                      <Item
                          name="font"
                          acceptedValues={fontValues}
                          options={fontOptions}
                      />
                      <Item name="separator" />
                      <Item name="bold" />
                      <Item name="italic" />
                      <Item name="strike" />
                      <Item name="underline" />
                      <Item name="separator" />
                      <Item name="alignLeft" />
                      <Item name="alignCenter" />
                      <Item name="alignRight" />
                      <Item name="alignJustify" />
                      <Item name="separator" />
                      <Item name="orderedList" />
                      <Item name="bulletList" />
                      <Item name="separator" />
                      <Item name="separator" />
                      <Item name="link" />
                      <Item name="separator" />
                    </Toolbar>
                  </HtmlEditor>
                </div>
              </div>
            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>
           

            <div className="row">
            <div className="dx-field-label">Бид хэрхэн ажилладаг вэ?:</div>
          <div className="dx-field-value">
          <HtmlEditor
                onValueChanged={consoleChange}
                ref={htmlEditorRef}
            >
              <MediaResizing enabled={true} />
              <Toolbar>
                <Item name="undo" />
                <Item name="separator" />
                <Item name="redo" />
                <Item name="separator" />
                <Item
                    name="size"
                    acceptedValues={sizeValues}
                    options={sizeOptions}
                />
                <Item name="separator" />
                <Item
                    name="font"
                    acceptedValues={fontValues}
                    options={fontOptions}
                />
                <Item name="separator" />
                <Item name="bold" />
                <Item name="italic" />
                <Item name="strike" />
                <Item name="underline" />
                <Item name="separator" />
                <Item name="alignLeft" />
                <Item name="alignCenter" />
                <Item name="alignRight" />
                <Item name="alignJustify" />
                <Item name="separator" />
                <Item name="orderedList" />
                <Item name="bulletList" />
                <Item name="separator" />
                <Item name="separator" />
                <Item name="link" />
                <Item name="separator" />
              </Toolbar>
            </HtmlEditor>
            </div>
            </div>
            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>

            <div className="row">
            <div className="dx-field-label">Бидний түүх:</div>
          <div className="dx-field-value">
          <HtmlEditor
                // height="40px"
                // width='50px'
                onValueChanged={consoleChange}
                ref={htmlEditorRef}
            >
              <MediaResizing enabled={true} />
              <Toolbar>
                <Item name="undo" />
                <Item name="separator" />
                <Item name="redo" />
                <Item name="separator" />
                <Item
                    name="size"
                    acceptedValues={sizeValues}
                    options={sizeOptions}
                />
                <Item name="separator" />
                <Item
                    name="font"
                    acceptedValues={fontValues}
                    options={fontOptions}
                />
                <Item name="separator" />
                <Item name="bold" />
                <Item name="italic" />
                <Item name="strike" />
                <Item name="underline" />
                <Item name="separator" />
                <Item name="alignLeft" />
                <Item name="alignCenter" />
                <Item name="alignRight" />
                <Item name="alignJustify" />
                <Item name="separator" />
                <Item name="orderedList" />
                <Item name="bulletList" />
                <Item name="separator" />
                <Item name="separator" />
                <Item name="link" />
                <Item name="separator" />
              </Toolbar>
            </HtmlEditor>
            </div>
            </div>

            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>

            <div className="dx-field">
            <div className="dx-field-label">Баннер оруулах:</div>
            <div className="dx-value">
            <FileUploader
            multiple=""
            accept=""
            uploadMode=""
            uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
            onValueChanged="" />
            </div>
            </div>
            <div className="dx-field">
             <div className="dx-field-label">Түүхэн замнал:</div>
             <div className="dx-value">
             <FileUploader
            multiple=""
            accept=""
            uploadMode=""
            uploadUrl=""
            onValueChanged="" />
            <DevExtremeButton text="Хадгалах" type="normal"
                  stylingMode="contained"  style={{left:1000,bottom:10, position: 'absolute',}}/>
            </div>
            </div>
            


            </form>
            
            
        
        
        </ScrollView>
            </Popup>
        </div>

    );

};
export default CrudGeneralInfo;




