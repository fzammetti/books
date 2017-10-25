Here are the comments for this article:<ul>
<#list commentItems as commentItem><li>
    Posted by ${commentItem.POSTER} on ${commentItem.POSTED}
  <br><br>
   ${commentItem.TEXT}
  </li><br>
</#list></ul>
<#if dwikiUser = true>
Add a comment:
<br>
<textarea id="commentText" cols="80" rows="10"></textarea>
<br>
<input type="button" value="Click To Add Comment"
  onClick="DWiki.addComment();">
</#if>
