package app;


import java.util.ArrayList;
import java.util.List;


/**
 * A simple bean to test bean setting.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class StudentRegistry {


  /**
   * The list of students in the registry.
   */
  private static List<Student> students = new ArrayList<Student>();


  /**
   * Add a student to the registry.
   *
   * @param  inStudent The student to add.
   * @return           A string representation of the registry.
   */
  public String addStudent(final Student inStudent) {

    students.add(inStudent);
    return students.toString();

  } // End addStudent().


} // End class.
