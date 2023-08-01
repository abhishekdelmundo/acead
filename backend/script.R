# define the reference class "student"
student <- setRefClass("student",
  fields = list(
    name = "character",
    age = "numeric",
    GPA = "numeric"
  )
)

# create an instance of the "student" reference class
s <- student$new(
  name = "John",
  age = 21,
  GPA = 3.5
)

# print the instance
print(s)