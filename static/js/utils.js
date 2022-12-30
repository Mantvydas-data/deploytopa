window.onload = function() {
    showViewAll();
    getAllAjax();
  };
  
  function showCreate(){
      document.getElementById('showCreateButton').style.display="none"
      document.getElementById('stockTable').style.display="none"
      document.getElementById('createUpdateForm').style.display="block"
      document.getElementById('valueportfolio').style.display="none"
  
      document.getElementById('createLabel').style.display="inline"
      document.getElementById('updateLabel').style.display="none"
  
      document.getElementById('doCreateButton').style.display="block"
      document.getElementById('doUpdateButton').style.display="none"
  
  }
  function showViewAll(){
      document.getElementById('showCreateButton').style.display="block"
      document.getElementById('stockTable').style.display="block"
      document.getElementById('createUpdateForm').style.display="none"
      calculateSum();
      document.getElementById('valueportfolio').style.display="block"
  
  }
  function showUpdate(buttonElement){
      document.getElementById('showCreateButton').style.display="none"
      document.getElementById('stockTable').style.display="none"
      document.getElementById('createUpdateForm').style.display="block"
  
      document.getElementById('createLabel').style.display="none"
      document.getElementById('updateLabel').style.display="inline"
  
      document.getElementById('doCreateButton').style.display="none"
      document.getElementById('doUpdateButton').style.display="block"
  
  
      var rowElement = buttonElement.parentNode.parentNode
      // these is a way of finding the closest <tr> which would safer, closest()
      
      var stock = getStockFromRow(rowElement)
      populateFormWithStock(stock)
  }
  function doCreate(){
      var form = document.getElementById('createUpdateForm')
  
      var stock = {}
     
      stock.ticker = form.querySelector('input[name="ticker"]').value
      stock.sname = form.querySelector('input[name="sname"]').value
      stock.pprice = form.querySelector('input[name="pprice"]').value
      stock.quantity = form.querySelector('input[name="quantity"]').value
      console.log(JSON.stringify(stock))
      createStockAjax(stock)
  }
  
  function doUpdate(){
      var stock = getStockFromForm();
      var rowElement = document.getElementById(stock.id);
      updateStockAjax(stock);
      setStockInRow(rowElement,stock);
     
      clearForm();
      showViewAll();
  }
  
  function doDelete(s){
      var tableElement = document.getElementById('stockTable');
      var rowElement = s.parentNode.parentNode;
      var index = rowElement.rowIndex;
      deleteStockAjax(rowElement.getAttribute("id"));
      tableElement.deleteRow(index);
  }
  
  function doPlot(p){
      var rowElement = p.parentNode.parentNode;
      stock.ticker = rowElement.cells[1].firstChild.textContent
      //console.log(stock.ticker);
      getdata(stock.ticker);
  }    
  
  function getdata(tickername){
      // Add spinner
      document.getElementById('myDiv').innerHTML=''
      document.getElementById('stockTable').style.display='none'
      document.getElementById('spinner').style.display='block'
  
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/mboum/'+encodeURI(tickername));
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
  
      xhr.onload = function() {
          // Remove spinner
          document.getElementById('spinner').style.display='none'
          document.getElementById('stockTable').style.display='block'
          plotting(JSON.parse(xhr.response));
      };
  }
  
  function plotting(data){
  
      var dates = [];
      var closes = [];
      var open1 = [];
      for (var key in data["items"]){
          //console.log(data["items"][key]["close"]);
          dates.push(data["items"][key]["date"])
          closes.push(data["items"][key]["close"])
          open1.push(data["items"][key]["open"])
      }
  
      var trace1 = {
          type: "scatter",
          mode: "lines",
          name: data.meta.symbol+' Close Price',
          x: dates,
          y: closes,
          line: {color: '#17BECF'}
      }
  
      var trace2 = {
          type: "scatter",
          mode: "lines",
          name: data.meta.symbol+' Open Price',
          x: dates,
          y: open1,
          line: {color: '#7F7F7F'}
      }
  
      var data2 = [trace1,trace2];
  
      var layout = {
          title: 'Historical Performance Of '+data.meta.symbol+' Stock',
      };
  
      Plotly.newPlot('myDiv', data2, layout);
  }
  
  function plotCompare(input1, input2){
      console.log("INSIDE PLOTTING")
      var date1 = [];
      var date2 = [];
      var close1 = [];
      var close2 = [];
      if (input2){
          for (var key in input2["items"]){
              // console.log(, data["items"][key]["close"]);
              date2.push(input2["items"][key]["date"])
              close2.push(input2["items"][key]["close"])
      }
  
      for (var key in input1["items"]){
          // console.log(, data["items"][key]["close"]);
          date1.push(input1["items"][key]["date"])
          close1.push(input1["items"][key]["close"])
      }
  
      var trace1 = {
          type: "scatter",
          mode: "lines",
          name: input1.meta.symbol+' Stock Close',
          x: date1,
          y: close1,
          line: {color: '#17BECF'}
      }
  
      var data2 = [trace1];
  
      var layout = {
          title: input1.meta.symbol+' Basic Time Series',
      };
  
      if (input2){
          var trace2 = {
              type: "scatter",
              mode: "lines",
              name: input2.meta.symbol+' Stock Close',
              x: date2,
              y: close2,
              line: {color: '#7F7F7F'}
          }
          var data2 = [trace1,trace2];
          var layout = {
              title: 'Historical Performance Comparison of '+input1.meta.symbol+' and '+input2.meta.symbol,
          };
      }
      
      Plotly.newPlot('myDiv', data2, layout);
  }
  }
  
  function getcomparisondata(){
      var tickername1 = document.getElementById("tickername1").value
      var tickername2 = document.getElementById("tickername2").value
  
      
      $.when(
          $.ajax({          
              cache: false,
              "url": "https://mboum-finance.p.rapidapi.com/hi/history?symbol="+tickername1+"&interval=1d&diffandsplits=false",
              "method": "GET",
              "headers": {
                  "X-RapidAPI-Key": "cb13e099f6msh76bac0554262195p1e57e4jsnec3cb7675f2c",
                  "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com"
              },
  
  
              success: function(returnhtml){     
                      result1 = returnhtml;                  
              }           
          }),
  
          $.ajax({ 
              cache: false,
              "url": "https://mboum-finance.p.rapidapi.com/hi/history?symbol="+tickername2+"&interval=1d&diffandsplits=false",
              "method": "GET",
              "headers": {
                  "X-RapidAPI-Key": "cb13e099f6msh76bac0554262195p1e57e4jsnec3cb7675f2c",
                  "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com"
              },
  
              success: function(returnhtml){                          
                  result2 = returnhtml;     
              }           
          })
  
      ).then(function() {
          document.getElementById('hideCompare').style.display='block'
          document.getElementById('spinner').style.display='none'
          plotCompare(result1,result2);
      });
  }
  
  function calculateSum(){
      // Calculate sum from table values
      // From https://www.youtube.com/watch?v=2p39swI3_Rs&ab_channel=1BestCsharpblog
      var outputField = document.getElementById("totalSum");
      var stockTable = document.getElementById("stockTable");
      var sum = 0;
      var sumvalue = 0;
      for (var i = 1; i < stockTable.rows.length; i++) {
          sumvalue = stockTable.rows[i].cells[3].innerHTML * stockTable.rows[i].cells[4].innerHTML;
          sum = sum + sumvalue;
      }
      
      // Rounding https://stackoverflow.com/a/6134070/19501420
      // Change text of element https://stackoverflow.com/a/1491758/19501420
      $("#totalSum").text((Math.round(sum * 100) / 100).toFixed(3));
  }
  
  
  if ($(document.getElementById('formdata')).length){
      var form = document.getElementById('formdata');
      form.addEventListener('submit', function(event) {
          document.getElementById('myDiv').innerHTML=''
          document.getElementById('hideCompare').style.display='none'
          document.getElementById('spinner').style.display='block'
          event.preventDefault(); 
          getcomparisondata();
      });
  }
  
  
  function addStockToTable(stock){
      var tableElement = document.getElementById('stockTable')
      var rowElement = tableElement.insertRow(-1)
      rowElement.setAttribute('id',stock.id)
      var cell1 = rowElement.insertCell(0);
      cell1.innerHTML = stock.id
      var cell2 = rowElement.insertCell(1);
      cell2.innerHTML = stock.ticker
      var cell3 = rowElement.insertCell(2);
      cell3.innerHTML = stock.sname
      var cell4 = rowElement.insertCell(3);
      cell4.innerHTML = stock.pprice
      var cell5 = rowElement.insertCell(4);
      cell5.innerHTML = stock.quantity
      var cell6 = rowElement.insertCell(5);
      cell6.innerHTML = '<button class="btn btn-outline-secondary btn-sm" onclick="showUpdate(this)">Update</button>'
      var cell7 = rowElement.insertCell(6);
      cell7.innerHTML = '<button class="btn btn-outline-secondary btn-sm" onclick=doDelete(this)>Delete</button>'
      var cell8 = rowElement.insertCell(7);
      cell8.innerHTML = '<button class="btn btn-outline-secondary btn-sm" onclick=doPlot(this)>Historical Performance</button>'
  
  }
  
  function clearForm(){
      var form = document.getElementById('createUpdateForm')
  
      form.querySelector('input[name="ticker"]').value=''
      form.querySelector('input[name="sname"]').value=''
      form.querySelector('input[name="pprice"]').value=''
      form.querySelector('input[name="quantity"]').value=''
  }
  function getStockFromRow(rowElement){
      stock.id  = rowElement.getAttribute('id')
      stock.ticker = rowElement.cells[1].firstChild.textContent
      stock.sname = rowElement.cells[2].firstChild.textContent
      stock.pprice = parseFloat(rowElement.cells[3].firstChild.textContent,10)
      stock.quantity = parseFloat(rowElement.cells[4].firstChild.textContent,10)
      return stock
  }
  function setStockInRow(rowElement, stock){
      rowElement.cells[0].firstChild.textContent= stock.id  
      rowElement.cells[1].firstChild.textContent= stock.ticker 
      rowElement.cells[2].firstChild.textContent= stock.sname
      rowElement.cells[3].firstChild.textContent= stock.pprice
      rowElement.cells[4].firstChild.textContent= stock.quantity
  }
  function populateFormWithStock(stock){
      var form = document.getElementById('createUpdateForm')
  
      form.querySelector('input[name="id"]').disabled = true
  
      form.querySelector('input[name="id"]').value= stock.id
      form.querySelector('input[name="ticker"]').value= stock.ticker
      form.querySelector('input[name="sname"]').value= stock.sname
      form.querySelector('input[name="pprice"]').value= stock.pprice
      form.querySelector('input[name="quantity"]').value= stock.quantity
      return stock
  }
  function getStockFromForm(){
      var form = document.getElementById('createUpdateForm')
      var stock = {}
      stock.id = form.querySelector('input[name="id"]').value
      stock.ticker = form.querySelector('input[name="ticker"]').value
      stock.sname = form.querySelector('input[name="sname"]').value
      stock.pprice = parseFloat(form.querySelector('input[name="pprice"]').value,10)
      stock.quantity = parseFloat(form.querySelector('input[name="quantity"]').value,10)
      console.log(JSON.stringify(stock))
      return stock
  }
  function getAllAjax(){
      host = window.location.origin
      $.ajax({
          url: "http://127.0.0.1:5000/stocks",
          method: "GET",
          dataType: "json",
          success: function(result){
              console.log(result);
              for (stock of result){
                  addStockToTable(stock);
              }
              calculateSum();
              
          },
          error: function(xhr,status,error){
              console.log("errorz: "+status+" msg:"+error);
          }
      });
  
  }
  function createStockAjax(stock){
      host = window.location.origin
      // console.log(JSON.stringify(stock));
      $.ajax({
          "url": "http://127.0.0.1:5000/stocks",
          "method":"POST",
          "data": JSON.stringify(stock),
          "dataType": "json",
          contentType: "application/json; charset=utf-8",
          "success":function(result){
              //console.log(result);
              stock.id = result.id
              addStockToTable(stock)
              clearForm()
              showViewAll()
          },
          "error":function(xhr,status,error){
              console.log("error: "+status+" msg:"+error);
          }
      });
  }
  function updateStockAjax(stock){
      console.log(JSON.stringify(stock));
      $.ajax({
          "url": "http://127.0.0.1:5000/stocks/"+encodeURI(stock.id),
          "method":"PUT",
          "data":JSON.stringify(stock),
          "dataType": "JSON",
          contentType: "application/json; charset=utf-8",
          "success":function(result){
                
          },
          "error":function(xhr,status,error){
              console.log("error: "+status+" msg:"+error);
          }
      });
  }
  function deleteStockAjax(id){
      
      //console.log(JSON.stringify('deleting '+id));
      $.ajax({
          "url": "http://127.0.0.1:5000/stocks/"+encodeURI(id),
          "method":"DELETE",
          "data":"",
          "dataType": "JSON",
          contentType: "application/json; charset=utf-8",
          "success":function(result){
              //console.log(result);
                
          },
          "error":function(xhr,status,error){
              console.log("error:…")
          }
      });
  };