/*
    TimekeeperExt - From the book "Practical Ext JS Projects With Gears"
    Copyright (C) 2008 Frank W. Zammetti
    fzammetti@omnytex.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses.
*/


//
// JSON that describes the project summary main display panel.
//


var uioProjectSummary = {
  bodyStyle : "padding-left:40px;padding-right:40px;padding-top:30px;",
  autoScroll : true, items : [
    {
      border : false, html :
        "<div class='cssSummaryTitle'>Project Summary</div>"
    },
    /* Project Details. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>Project Details</div>"
    },
    {
      xtype : "grid", id : "gdProjectSummaryDetails", trackMouseOver : false,
      store : tempProjectSummaryDetails, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        {
          header : "Status", sortable : false, dataIndex : "status",
          align : "center"
        },
        { header : "Name", sortable : false, dataIndex : "name" },
        {
          header : "Description", sortable : false, dataIndex : "description",
          id : "colDescription"
        },
        {
          header : "Project Manager", sortable : false,
          dataIndex : "projectmanager"
        },
        { header : "Start Date", sortable : false, dataIndex : "startdate" },
        { header : "End Date", sortable : false, dataIndex : "enddate" },
        {
          header : "Allocated Hours", sortable : false,
          dataIndex : "allocatedhours"
          },
        { header : "Booked Time", sortable : true, dataIndex : "bookedtime" }
      ]
    },
    /* Tasks allocated to this project. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>" +
        "Tasks allocated to this project</div>"
    },
    {
      xtype : "grid", id : "gdProjectSummaryTasks", trackMouseOver : false,
      store : tempProjectSummaryTasks, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        new Ext.grid.ProgressBarSelectionModel({
          header : "Percent Completed", dataIndex : "percentcomplete",
          align : "center"
        }),
        {
          header : "Status", sortable : false, dataIndex : "status",
          align : "center"
        },
        { header : "Name", sortable : true, dataIndex : "name" },
        {
          header : "Description", sortable : true, dataIndex : "description",
          id : "colDescription"
        },
        { header : "Booked Time", sortable : true, dataIndex : "bookedtime" }
      ]
    },
    /* Resources involved with this project. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>" +
        "Resources involved with this project</div>"
    },
    {
      xtype : "grid", id : "gdProjectSummaryResources", trackMouseOver : false,
      store : tempProjectSummaryResources, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        { header : "Name", sortable : true, dataIndex : "name" },
        {
          header : "Description", sortable : true, dataIndex : "description",
          id : "colDescription"
        }
      ]
    }
  ]
};
