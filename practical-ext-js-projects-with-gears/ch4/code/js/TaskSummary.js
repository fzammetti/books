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
// JSON that describes the task summary main display panel.
//


var uioTaskSummary = {
  bodyStyle : "padding-left:40px;padding-right:40px;padding-top:30px;",
  autoScroll : true, items : [
    {
      border : false, html :
        "<div class='cssSummaryTitle'>Task Summary</div>"
    },
    /* Task Details. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>Task Details</div>"
    },
    {
      xtype : "grid", id : "gdTaskSummaryDetails", trackMouseOver : false,
      store : tempTaskSummaryDetails, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        new Ext.grid.ProgressBarSelectionModel({
          header : "Percent Completed", dataIndex :"percentcomplete",
          align : "center"
        }),
        {
          header : "Status", sortable : false, dataIndex : "status",
          align : "center"
          },
        { header : "Name", sortable : false, dataIndex : "name" },
        {
          header : "Description", sortable : false, dataIndex : "description",
          id : "colDescription"
        },
        { header : "Start Date", sortable : false, dataIndex : "startdate" },
        { header : "End Date", sortable : false, dataIndex : "enddate" },
        {
          header : "Allocated Hours", sortable : false,
          dataIndex : "allocatedhours"
          },
        { header : "Booked Time", sortable : true, dataIndex : "bookedtime" },
        { header : "Project", sortable : false, dataIndex : "project" },
        { header : "Resource", sortable : false, dataIndex : "resource" }
      ]
    },
    /* Resource assigned to this task. */
    {
      border: false, bodyStyle : "padding-top:30px", html :
        "<div class='cssSummaryTableHeader'>" +
        "Resource assigned to this task</div>"
    },
    {
      xtype : "grid", id : "gdResourceSummaryResource", trackMouseOver : false,
      store : tempResourceSummaryResource, autoHeight : true, stripeRows : true,
      disableSelection : true, autoExpandColumn : "colDescription",
      columns : [
        { header : "Name", sortable : false, dataIndex : "name" },
        {
          header : "Description", sortable : false, dataIndex : "description",
          id : "colDescription"
        }
      ]
    }
  ]
};
