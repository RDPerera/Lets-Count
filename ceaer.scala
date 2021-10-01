//19001428

object Q{
    def main(args:Array[String]):Unit = {
        val p1 = Point(1, 2)
        val p2 = Point(11, 6)
        

        println("Addition:")
        println(p1 + p2)
        println()

        val p3 = p1.move(10, 8)
        println("Move:")
        println(p3)
        println()

        println("Distance:")
        println(distance(p1, p2))
        println()

        val p4 = p1.invert()
        println("Invert:")
        println(p4)
        println()

    }

    val distance = (p1:Point, p2:Point) => Math.sqrt((Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2)).toDouble)
}

case class Point(x:Int, y:Int){

    val + = (p:Point) => Point(this.x + p.x, this.y + p.y)

    val move = (dx:Int, dy:Int) => Point(this.x + dx, this.y + dy)
    
    val invert = () => Point(this.y, this.x)

    override def toString = "(" + this.x.toString() + ", " + this.y.toString() + ")"
}