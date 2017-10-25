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
// JSON that describes the resource summary main display panel.
//


var uioResourceSummary = {
  bodyStyle : "padding-left:40px;padding-right:40px;padding-top:30px;",
  autoScroll : true, items : [
    {
      border : false, html :
        "<div class='cssSummaryTitle'>Resource Summary</div>"
    },
    /* Resource Details. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>Resource Details</div>"
    },
    {
      xtype : "grid", id : "gdResourceSummaryDetails", trackMouseOver : false,
      store : tempResourceSummaryDetails, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        { header : "Name", sortable : false, dataIndex : "name" },
        {
          header : "Is A Project Manager?", sortable : false,
          dataIndex : "isaprojectmanager", width : 120
        },
        {
          header : "Description", sortable : false, dataIndex : "description",
          id : "colDescription"
        }
      ]
    },
    /* Projects this resource is involved with. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>" +
        "Projects this resource is involved with</div>"
    },
    {
      xtype : "grid", id : "gdResourceSummaryTasks", trackMouseOver : false,
      store : tempResourceSummaryProjects, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        { header : "Name", sortable : true, dataIndex : "name" },
        {
          header : "Description", sortable : true, dataIndex : "description",
          id : "colDescription"
        }
      ]
    },
    /* Tasks this resource is assigned to. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>" +
        "Tasks this resource is assignd to</div>"
      },
    {
      xtype : "grid", id : "gdResourceSummaryProjects", trackMouseOver : false,
      store : tempResourceSummaryTasks, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        new Ext.grid.ProgressBarSelectionModel({
          align : "center", header : "Percent Completed",
          dataIndex :"percentcomplete"
        }),
        {
          header : "Status", align : "center", sortable : false,
          dataIndex : "status"
        },
        { header : "Name", sortable : true, dataIndex : "name" },
        {
          header : "Description", sortable : true, dataIndex : "description",
          id : "colDescription"
        },
        { header : "Booked Time", sortable : true, dataIndex : "bookedtime" },
        { header : "Project", sortable : true, dataIndex : "project" }
      ]
    }
  ]
};
