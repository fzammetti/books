Here is the history for this article:<ul>
<#list historyItems as historyItem><li><a href="javascript:void(0);"
  onClick="DWiki.toggleHistory('${historyItem.ARTICLETITLE}_${historyItem_index}');">
    Edited by ${historyItem.EDITEDBY} on ${historyItem.EDITED}
  </a><br><br>
  <div
    id="${historyItem.ARTICLETITLE}_${historyItem_index}" style="display:none";>
    <div style="background-color:#e0e0e0;">Previous Text:</div>
    ${historyItem.PREVIOUSTEXT}
    <br><br>
    <div style="background-color:#e0e0e0;">New Text:</div>
      ${historyItem.NEWTEXT}
    </div>
  </div>
  </li><br>
</#list>
