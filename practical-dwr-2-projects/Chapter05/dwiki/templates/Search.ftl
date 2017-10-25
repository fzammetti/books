<b>Search for articles</b>

<table border="0" cellpadding="2" cellspacing="2">
  <tr>
    <td>Text to search for:&nbsp;</td>
    <td><input type="text" id="searchText" size="40"
      value=""></td>
  </tr>
  <tr>
    <td>What to search:&nbsp;</td>
    <td>
      <select id="searchWhat">
        <option value="title">Article Titles Only</option>
        <option value="text">Article Text Only</option>
        <option
          value="both">Both Article Titles And Text</option>
      </select>
    </td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td><input type="button" value="Search"
      onClick="DWiki.getArticle('SearchResults', dwr.util.getValue('searchText'), dwr.util.getValue('searchWhat'));">
    </td>
  </tr>
</table>
