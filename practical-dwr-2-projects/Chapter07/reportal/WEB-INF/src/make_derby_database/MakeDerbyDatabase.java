import org.springframework.jdbc.core.*;
import org.springframework.jdbc.datasource.*;
import java.util.*;


public class MakeDerbyDatabase {


  public static void main(String[] args) {

    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName("org.apache.derby.jdbc.EmbeddedDriver");
    dataSource.setUrl("jdbc:derby:dvtestdb;create=true");
    dataSource.setUsername("");
    dataSource.setPassword("");
    JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
    try {
      jdbcTemplate.execute("DROP TABLE dvtable");
    } catch (Exception e) {
    }
    jdbcTemplate.execute(
      "CREATE TABLE dvtesttable ( " +
      "firstname VARCHAR(50), " +
      "middlename VARCHAR(50), " +
      "lastname VARCHAR(50), " +
      "title VARCHAR(50), " +
      "dob DATE, " +
      "age BIGINT, " +
      "paygrade CHAR, " +
      "salary NUMERIC" +
      ")"
    );
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Billy','Martin','Joel','Musician','05/09/1949',58,'C',86500.50)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Jessica','Marie','Alba','Actress','04/28/1981',24,'D',10000.00)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Bruce','William','Bocleitner','Actor','05/12/1950',57,'B',43567.25)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Noam','','Chomsky','Philosopher/Writer','12/07/1928',79,'A',85000.00)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Jessica','Ann','Simpson','Airhead','07/10/1980',27,'C',11122.75)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Bruce','Lome','Campbell','Coolest Man Alive','06/22/1958',49,'B',12345.50)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Kevin','Patrick','Smith','Second Coolest Man Alive','08/02/1970',37,'B',98873.00)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Lauren','Helen','Graham','Babe','03/16/1967',40,'A',39472.99)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Rick','Christopher','Wakeman','Keyboard God','05/18/1949',58,'A',10033.10)");
    jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.execute("INSERT INTO dvtesttable " +
      "(firstname,middlename,lastname,title,dob,age,paygrade,salary) VALUES (" +
      "'Amanda','','Tapping','Hottest Woman Alive','08/28/1965',42,'C',10101.01)");
    List data = jdbcTemplate.queryForList("SELECT * FROM dvtesttable");
    for (Iterator it = data.iterator(); it.hasNext();) {
      Map m = (Map)it.next();
      System.out.println(
        "firstname=" + m.get("FIRSTNAME") +
        ", middlename=" + m.get("MIDDLENAME") +
        ", lastname=" + m.get("MIDDLENAME") +
        ", title=" + m.get("TITLE") +
        ", dob=" + m.get("DOB") +
        ", age=" + m.get("AGE") +
        ", paygrade=" + m.get("PAYGRADE") +
        ", salary=" + m.get("SALARY"));
    }
  }


} // End class.
