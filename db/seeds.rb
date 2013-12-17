require 'benchmark'
require 'csv'
require 'bcrypt'
  
unencrypted_password = "password"
encrypted_password = BCrypt::Password.create(unencrypted_password)

#____________________30 different categories (3 per restaurant)_________________
 
categories = ["Appetizers", "Beverages", "Entrees", "Desserts",  "Specialties", "Burgers", "Soups", "Spicy Selections", "Vegetarian", "Salads", "Kids Menu", "Snacks", "Sandwiches", "Burritos", "Pizza", "Wraps", "Chicken Dishes", "Juices", "Alcoholic Beverages", "Vegan Options", "Specials", "Ethnic", "Tacos", "Burritos", "Seafood", "Fried Food"]

 
# time = Benchmark.measure do 

#  # RESTAURANTS FOR JOBS
# # mcdonalds  = Restaurant.find_by(name: "McDonalds")
# # whatthepho = Restaurant.find_by(name: "What The Pho")
 
# # USERS FOR JOBS
# # luke = User.find_by(email: "lukemartinez@gmail.com")
 
# # Job.create(
# #   [
# #     {
# #       user: luke, restaurant: mcdonalds, role: Role.owner
# #     },
# #     {
# #       user: luke, restaurant: whatthepho, role: Role.owner
# #     }
# #   ]
# )
#   #____________________30 different regions(cities)______________________________
  
#   albuquerque = City.create(city: "Albuquerque")
#   anchorage = City.create(city: "Anchorage")
#   atlanta = City.create(city: "Atlanta")
#   austin = City.create(city: "Austin")
#   boston = City.create(city: "Boston")
  
#   boulder = City.create(city: "Boulder")
#   burlington = City.create(city: "Burlington")
#   charlotte = City.create(city: "Charlotte")
#   chicago = City.create(city: "Chicago")
#   cincinnati = City.create(city: "Cincinatti")
  
#   chicago = City.create(city: "Chicago")
#   dallas = City.create(city: "Dallas")
#   dc = City.create(city: "Washington, D.C.")
#   detroit = City.create(city: "Detriot")
#   denver = City.create(city: "Denver")
  
#   honolulu = City.create(city: "Honolulu")
#   la = City.create(city: "Los Angeles")
#   little_rock = City.create(city: "Little Rock")
#   madison = City.create(city: "Madison")
#   miami = City.create(city: "Miami")
  
#   minneapolis = City.create(city: "Minneapolis")
#   nyc = City.create(city: "New York City")
#   philadelphia = City.create(city: "Philadelphia")
#   pittsburgh = City.create(city: "Pittsburgh")
#   portland = City.create(city: "Portland")
  
#   san_diego = City.create(city: "San Diego")
#   santa_fe = City.create(city: "Santa Fe")
#   seattle = City.create(city: "Seattle")
#   sanfran = City.create(city: "San Francisco")
#   tuscan = City.create(city: "Tucsan")
 
#   city = [albuquerque, anchorage, atlanta, austin, boston, boulder, burlington,
#     charlotte, chicago, cincinnati, chicago, dallas, dc, detroit, denver, honolulu,
#     la, little_rock, madison, miami, minneapolis, nyc, philadelphia, pittsburgh,
#     portland, san_diego, santa_fe, santa_fe, seattle, sanfran, tuscan ]
 
 
#   #_____________________10,000 different restuarants___________________________
 
#   #_________________________approved restaurants_______________________________
  
#   jamba_juice = Restaurant.create(name: "Jamba Juice", 
#     description: "Feel health drain down your throat", slug: "jamba-juice", 
#     status: "approved", city_id: austin.id, logo: "https://s3.amazonaws.com/bearlyhungry/jamba.jpg" )
#   luke = Restaurant.create(name: "Luke's Layover", 
#     description: "The finest airport cuisine around", slug: "lukes-layover", 
#     status: "approved", city_id: tuscan.id, logo: "https://s3.amazonaws.com/bearlyhungry/lukes.png" )
#   nathaniel = Restaurant.create(name: "Nathaniel's Nook", 
#     description: "A place to get caffineated and fat", slug: "nath-nook", 
#     status: "approved", city_id: nyc.id, logo: "https://s3.amazonaws.com/bearlyhungry/nath.png" )
#   kat = Restaurant.create(name: "Kat\'s Hot Cakes", 
#     description: "A crunchy vegan smorgsenbord", slug: "kats-hot-cakes", 
#     status: "approved", city_id: boston.id, logo: "https://s3.amazonaws.com/bearlyhungry/kats.png" )
#   chicago_pizza = Restaurant.create(name: "Chicago Pazzari", 
#     description: "Yum Pizza.", slug: "pazzari", 
#     status: "approved", city_id: portland.id, logo: "https://s3.amazonaws.com/bearlyhungry/pazzari.png" )
#   burger_king = Restaurant.create(name: "Burger King", 
#     description: "Get your burger on", slug: "burger-king", 
#     status: "approved", city_id: seattle.id , logo: "https://s3.amazonaws.com/bearlyhungry/burgerking.png")
#   taco_bell = Restaurant.create(name: "Taco Bell", 
#     description: "For the Mexican in you", slug: "taco-bell", 
#     status: "approved", city_id: sanfran.id, logo: "https://s3.amazonaws.com/bearlyhungry/tacobell.jpg")
#   ventus = Restaurant.create(name: "Ventus", 
#     description: "A perfect date place", slug: "ventus", 
#     status: "approved", city_id: dc.id, logo: "https://s3.amazonaws.com/bearlyhungry/ventus.jpg" )
#   mcdonalds = Restaurant.create(name: "Mcdonalds", 
#     description: "A task of beautiful Americano cuisine", slug: "mcdonalds", 
#     status: "approved", city_id: denver.id, logo:"https://s3.amazonaws.com/bearlyhungry/mcdon.jpg")
#   lukes_lobsters = Restaurant.create(name: "Luke's Lobsters", 
#     description: "Lobsters to make you poop red", slug: "lukes-lobsters", 
#     status: "approved", city_id: portland.id, logo: "https://s3.amazonaws.com/bearlyhungry/luke.png" )
  
 
#   #_________________________pending restaurants_______________________________
#   igloo_eats = Restaurant.create(name: "Igloo Eats", 
#     description: "Fish and cols beverages galore", slug: "igloo-eats", 
#     status: "pending", city_id: seattle.id )
 
#   #_________________________rejected restaurants_______________________________
#   larrys_lobsters = Restaurant.create(name: "Larry's Lobsters", 
#     description: "Lobsters to make you poop red", slug: "larry_lobsters", 
#     status: "rejected", city_id: portland.id )
  
#   restaurants = [ mcdonalds, burger_king, jamba_juice, luke, nathaniel, kat, chicago_pizza, lukes_lobsters, taco_bell, ventus ]
 
#   def clone_restaurant(restaurant, cities, count)
#     count.times do |i|
#       puts "creating restaurant #{restaurant.name} #{i}..."
#       r = restaurant.dup
#       r.update(
#         name: restaurant.name + "#{i}",
#         status: restaurant.status,
#         slug: restaurant.slug + "#{i}",
#         city_id: restaurant.city_id[rand(30)])
#     end
#   end
 
#   restaurants.each {|r| clone_restaurant(r, city, 10) }
#   #restaurants.each {|r| clone_restaurant(r, cities, 1000) }
 
 
 
# #____________________20 different items per restaurant______________________
 
  
#   # restaurants = [ mcdonalds, burger_king, jamba_juice, luke, nathaniel, kat, chicago_pizza, lukes_lobsters, taco_bell, ventus ]
#   # mcdonalds_menu = ["Apple Slices", "Bacon Buffalo Ranch McChicken",
#   # "Bacon Cheddar McChicken", "Bacon McDouble", "Bacon, Egg & Cheese Bagel", "Baked Holiday Pie", "Baked Hot Apple Pie", "BBQ Ranch Burger" , "Big Breakfast with Hotcakes (Regular Size Biscuit)", "Big Breakfast with Egg Whites (Large Size Biscuit)", "Big Breakfast with Egg Whites (Regular Size Biscuit)", "Big Breakfast with Hotcakes", "Big Breakfast with Hotcakes and Egg Whites (Large Biscuit)" ]
#   # burger_king_menu = ["WHOPPER Sandwich ", "Fries", "Nuggets", "Wrap", "Hamburger", "Double Cheeseburger", "French Fry Burger", "BBQ Rib Sandwich", "Chicken Nuggets- 4pc "]
#   # jamba_juice_menu = ["Strawberry Bannana", "Mango Delight", "Acai Energy", "Orange Surprise", "Bannana Yum", "Peachy Keen", "Blueberry Mix", "Raspberry Smooth", "Blackberry Blend"]
#   # luke_menu = ["Crumpy Chicken", "Madras Sanbar", "Naan", "Saag Paneer", "Aloo Chat", "Aloo Gobi" , "Sushi"]
#   # nathaniel_menu = ["Blackened Chicken Muffaletta", "Buffalo Chicken", "Tuscan Chicken Pasta", ""]
#   # kat_menu = ["Raw Pie", "Carmalized Cheese", "Tree Hugger", "Krip Salad", "Tofu Delight", "Light Faire", "Daily Special"]
#   # chicago_pizza_menu = ["Pepperoni Pizza", "Deep Dish Pie", "Calzone", "Chef's Pizza", "Veggie Special", "Mushroom Delight", "Hawaiian Yum", "Cheesy Cheese", "Anchove"]
#   # lukes_lobsters_menu = ["Hot Lobster", "Spicy Lobster", "Sweet Lobster", "Garlic Lobster", "Steamed Whole Lobster", "Pickled Lobster",
#   #   "Steak and Lobster", "Chocolate Lobster" ]
#   # taco_bell_menu = ["Burritos", "Gordita", "Salads", "Nachos", "Chalupas", "Beefy Nacho Griller", "Steak Quesadilla"]
#   # ventus_menu = ["Meatballs", "Spaghetti", "Bruschetta", "Caponata", "Spaghetti", "Bruschetta", "Arancini", "Buridda", "Osso Buco", "Calamaretti Fritti", "Seppioline in Umido", "Tortano"]
#   # igloo_eats_menu = ["Salmon", "Crepe", "Tuna", "Big Tuna"]
#   # larrys_lobsters_menu = ["Hot Lobster", "Spicy Lobster", "Sweet Lobster", "Garlic Lobster", "Steamed Whole Lobster", 
#   #   "Steak and Lobster", "Chocolate Lobster", "Pickled Lobster" ]
  
#   # menu_lookup = { mcdonalds.slug => mcdonalds_menu,
#   #                 burger_king.slug => burger_king_menu,  
#   #                 luke.slug => luke_menu,
#   #                 nathaniel.slug => nathaniel_menu,
#   #                 kat.slug => kat_menu,
#   #                 chicago_pizza.slug => chicago_pizza_menu,
#   #                 lukes_lobsters.slug => lukes_lobsters_menu,
#   #                 jamba_juice.slug => jamba_juice_menu,
#   #                 taco_bell.slug => taco_bell_menu,
#   #                 ventus.slug => ventus_menu  }

#   # superlatives = ["juicy", "delicious", "yummy", "classy", "enjoyable", "tasty", "savory", "refreshing", "disgusting"]

#   # Restaurant.all.each { |rest| seed_items(rest, menu_lookup[rest.slug.gsub(/\d+/, "")], superlatives, 3) }
 
# 
#   def seed_categories(restaurant, categories, count)
#     count.times do |i|
#       begin
#         puts "Creating category #{i} for #{restaurant.name}..."
#         category = categories[i]
#         restaurant.categories.create(title: category,
#                                     restaurant_id: restaurant.id)
#       rescue
#         # binding.pry
#         puts "Category already exists! Trying again..."
#         retry
#       end
#     end
#   end

#   def seed_item_categories(restaurant, count)
#     count.times do |i|
#       begin
#         puts "Seeding item category ##{i} for #{restaurant.name}..."
#         item_id = restaurant.items[i - 1].id
#         category_id = restaurant.categories[rand(5)].id
#         ItemCategory.create!( item_id: item_id,
#                               category_id: category_id)
#       rescue
#         binding.pry
#         puts "Item category failed to create! Trying again..."
#         retry
#       end
#     end
#   end
 
#   Restaurant.all.each do |rest| 
#     @count ||= rest.items.size
#     seed_item_categories(rest, @count)
#   end
 
# #_________________________100,000 users_______________________________
 
 
#   jorge = User.create(email: "demo+jorge@jumpstartlab.com", 
#       full_name: "Jorge", 
#       display_name: "littlemexican", 
#       password: unencrypted_password,
#       password_confirmation: unencrypted_password,
#       admin_status: true
#     )
 
#   jeff = User.create(email: "demo+jeff@jumpstartlab.com", 
#     full_name: "Jeff", 
#     display_name: "j3",
#     password: unencrypted_password,
#     password_confirmation: unencrypted_password,
#     admin_status: true)
 
# katrina = User.create(email: "demo+katrina@jumpstartlab.com", 
#     full_name: "Katrina Owen", 
#     display_name: "kytrynx", 
#     password: unencrypted_password,
#     password_confirmation: unencrypted_password,
#     admin_status: true)
 
# kat = User.create(email: "katrina@engelsted.co", 
#     full_name: "Katrina Engelsted", 
#     display_name: "mapppingkat", 
#     password: unencrypted_password,
#     password_confirmation: unencrypted_password,
#     admin_status: false)
 
#   luke = User.create(email: "lukemartinez@gmail.com", 
#     full_name: "Luke", 
#     display_name: "Lukey", 
#     password: unencrypted_password,
#     password_confirmation: unencrypted_password,
#     admin_status: false)
 
#   nathaniel = User.create(email: "watts@nathanielwatts.com", 
#     full_name: "Nathaniel", 
#     display_name: "thewatts", 
#     password: unencrypted_password,
#     password_confirmation: unencrypted_password,
#     admin_status: true)
 
#   def seed_users(count)
#     count.times do |i|
#       puts "Creating user #{i}"
#       User.create(
#         full_name: "user_number_#{i}",
#         display_name: "user_#{i}",
#         email: "user_#{i}@example.com",
#         password: "unencrypted_password",
#         password_confirmation: "unencrypted_password")
#     end
#   end
 
#   #seed_users(100000)
#   seed_users(100)
 
#   def seed_restaurant_users(rest_id, role, count)
#     unless ['customer', 'employee', 'owner'].include?(role)
#       throw ArgumentError "Role must be customer, employee, owner"
#   end
 
#     count.times do |i|
#       begin 
#         puts "Seeding #{role} number #{i} for restaurant #{rest_id}..."
#         Job.create(
#           restaurant_id: rest_id,
#           user_id: User.all[rand(@size)],
#           role_id: role)
#       rescue
#         puts "Failed to create role! Trying again..."
#         retry
#       end
#     end
#   end
 
#   @size = Job.all.size
 
#   Job.all.each { |r| seed_restaurant_users(r.id, "employee", 2) }
#   Job.all.each { |r| seed_restaurant_users(r.id, "owner", 2) }
 
 
# #_________________________orders_______________________________
# puts "Creating Orders"
# Order.create([{ status: "pending"},
#               { status: "pending"},
#               { status: "in progress", user_id: 1},
#               { status: "in progress", user_id: 2},
#               { status: "paid", user_id: 3},
#               { status: "paid", user_id: 1},
#               { status: "completed", user_id: 2},
#               { status: "completed", user_id: 3},
#               { status: "cancelled", user_id: 1},
#               { status: "cancelled", user_id: 2}])
 
# puts "Creating Orders Items"
# OrderItem.create([{ item_id: 1, order_id: 1, quantity: 3},
#                   { item_id: 16, order_id: 1},
#                   { item_id: 24, order_id: 1, quantity: 2},
#                   { item_id: 30, order_id: 2, quantity: 3},
#                   { item_id: 16, order_id: 2},
#                   { item_id: 12, order_id: 2, quantity: 2},
#                   { item_id: 1, order_id: 3},
#                   { item_id: 16, order_id: 3, quantity: 2},
#                   { item_id: 17, order_id: 3, quantity: 3},
#                   { item_id: 1, order_id: 4, quantity: 2},
#                   { item_id: 16, order_id: 4, quantity: 2},
#                   { item_id: 35, order_id: 4, quantity: 3},
#                   { item_id: 2, order_id: 5, quantity: 2},
#                   { item_id: 16, order_id: 5},
#                   { item_id: 3, order_id: 6},
#                   { item_id: 16, order_id: 6, quantity: 3},
#                   { item_id: 30, order_id: 6, quantity: 3},
#                   { item_id: 1, order_id: 7},
#                   { item_id: 7, order_id: 8},
#                   { item_id: 16, order_id: 9, quantity: 2},
#                   { item_id: 4, order_id: 10, quantity: 5},
#                   { item_id: 16, order_id: 10, quantity: 3},
#                   { item_id: 31, order_id: 10, quantity: 7}])
 
# #_________________________images______________________________
# images = File.open "./app/assets/images"

# puts "Time to seed:"
# puts time
# end
