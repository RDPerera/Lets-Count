import java.util.Scanner;
import scala.util.Sorting

object Q1{
    def main(args:Array[String]):Unit = {
        var scanner = new Scanner(System.in);

        //get number of test cases.
        var testcasesCount = scanner.nextInt();
        
        for(i <- 1 to testcasesCount){
            //get number of skill levels.
            var noOfStudents = scanner.nextInt();


            //get skill level of each student
            var studentSkillLevels:List[Int] = List();
            for(j <- 1 to noOfStudents){
                studentSkillLevels = studentSkillLevels :+ scanner.nextInt();
            }

            //get the frequency of skill levels
            var skillFrequency:List[(Int, Int)] = studentSkillLevels.map(x => (x, studentSkillLevels.count(_ == x))).distinct;
            //sort the frequency of skill levels -> descending
            var skillFrequencySort = scala.util.Sorting.stableSort(skillFrequency , (a : (Int, Int), b : (Int, Int)) => a._2 > b._2);

            //Store initial value of the groups
            // var groupPreviousValue:List[Double] = List.fill(skillFrequencySort.apply(0)._2)(1.5);
            //Store initial size of the groups
            var groupSize:List[Int] = List.fill(skillFrequencySort.apply(0)._2)(0);

            for(skillNo <- 0 to skillFrequencySort.size - 1){
                for(skillNoCount <- 1 to skillFrequencySort.apply(skillNo)._2){
                    var groupIndex = groupSize.indexOf(groupSize.min);
                    // groupPreviousValue = groupPreviousValue.updated(groupIndex, skillFrequencySort.apply(skillNo)._1);
                    groupSize = groupSize.updated(groupIndex, groupSize.apply(groupIndex)+1);
                }
            }

            println(groupSize.min);
        }
    }
}