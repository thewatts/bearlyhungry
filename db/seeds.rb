require 'benchmark'
require 'bcrypt'
require 'csv'

time = Benchmark.measure do 

  #_____________________10,000 different restuarants___________________________

  #_________________________approved restaurants_______________________________

  mcdonalds = Restaurant.create(name: "Mcdonalds", 
  description: "A task of beautiful Americano cuisine", slug: "mcdonalds", 
  status: "approved", cities_id: denver.id )
  burgerking = Restaurant.create(name: "Burger King", 
    description: "Get your burger on", slug: "burgerking", 
    status: "approved", #cities_id: seattle.id )
  jambajuice = Restaurant.create(name: "Jamba Juice", 
    description: "Get your burger on", slug: "taste-of-india", 
    status: "approved", #cities_id: seattle.id )
  luke = Restaurant.create(name: "Luke's Layover", 
    description: "The finest airport cuisine around", slug: "lukes-layover", 
    status: "approved", #cities_id: tuscan.id )
  nathaniel = Restaurant.create(name: "Nathaniel's Nook", 
    description: "A place to get caffineated and fat", slug: "nath-nook", 
    status: "approved", #cities_id: nyc.id )
  kat = Restaurant.create(name: "Kat's Kitchen", 
    description: "A crunchy vegan smorgsenbord", slug: "kats-kitchen", 
    status: "approved", #cities_id: boston.id )
  chicago_pizza = Restaurant.create(name: "Chicago Pazzari", 
    description: "Yum Pizza.", slug: "pazzari", 
    status: "approved", cities_id: portland.id )


  #_________________________pending restaurants_______________________________
  igloo_eats = Restaurant.create(name: "Igloo Eats", 
    description: "Fish and cols beverages galore", slug: "igloo-eats", 
    status: "pending", cities_id: seattle.id )

  #_________________________rejected restaurants_______________________________
  larrys_lobsters = Restaurant.create(name: "Larry's Lobsters", 
    description: "Lobsters to make you poop red", slug: "larry_lobsters", 
    status: "rejected", cities_id: portland.id )
  
  restaurants = [taste_of_india, luke, nathaniel, kat, chicago_pizza, igloo_eats,
    larry_lobsters]

  def clone_restaurant(restaurant, cities, count)
    count.times do |i|
      puts "creating restaurant #{restaurant.name} #{i}..."
      r = restaurant.dup
      r.update(
        name: restaurant.name + "#{i}",
        status: restaurant.status,
        slug: restaurant.slug + "#{i}",
        Cities: Citiess[rand(30)])
    end
  end

  restaurants.each {|r| clone_restaurant(r, cities, 10) }
  #restaurants.each {|r| clone_restaurant(r, cities, 1000) }

#____________________30 different regions(cities)______________________________
  
  albuquerque = Cities.create(city: "Albuquerque")
  anchorage = Cities.create(city: "Anchorage")
  atlanta = Cities.create(city: "Atlanta")
  austin = Cities.create(city: "Austin")
  boston = Cities.create(city: "Boston")
  
  boulder = Cities.create(city: "Boulder")
  burlington = Cities.create(city: "Burlington")
  charlotte = Cities.create(city: "Charlotte")
  chicago = Cities.create(city: "Chicago")
  cincinnati = Cities.create(city: "Cincinatti")
  
  chicago = Cities.create(city: "Chicago")
  dallas = Cities.create(city: "Dallas")
  dc = Cities.create(city: "Washington, D.C.")
  detroit = Cities.create(city: "Detriot")
  denver = Cities.create(city: "Denver")
  
  honolulu = Cities.create(city: "Honolulu")
  la = Cities.create(city: "Los Angeles")
  little_rock = Cities.create(city: "Little Rock")
  madison = Cities.create(city: "Madison")
  miami = Cities.create(city: "Miami")
  
  minneapolis = Cities.create(city: "Minneapolis")
  nyc = Cities.create(city: "New York City")
  philadelphia = Cities.create(city: "Philadelphia")
  pittsburgh = Cities.create(city: "Pittsburgh")
  portland = Cities.create(city: "Portland")
  
  san_diego = Cities.create(city: "San Diego")
  santa_fe = Cities.create(city: "Santa Fe")
  seattle = Cities.create(city: "Seattle")
  sanfran = Cities.create(city: "San Francisco")
  tuscon = Cities.create(city: "Tucson")

  cities = [albuquerque, anchorage, atlanta, austin, boston, boulder, burlington,
    charlotte, chicago, cincinnacti, chicago, dallas, dc, detroit, denver, honolulu,
    la, little_rock, madison, miami, minneapolis, nyc, philadelphia, pittsburgh,
    portland, san_diego, santa_fe, santa_fe, seattle, sanfran, tuscan ]


#____________________20 different items per restaurant______________________

  puts "Creating Items, Categories, and ItemCategories"
  # contents = CSV.open "./db/db_seed.csv", headers: true, header_converters: :symbol

  # contents.each do |row|
  #   title       = row[:title]
  #   description = row[:description]
  #   category    = row[:category]
  #   image_file_name = row[:image_file_name]
  #   category_object = Category.find_or_create_by(title: category, type_of: 'main_menu')
  #   item = Item.create(title: title, description: description, price: price, image_file_name: image_file_name)

  #   ItemCategory.create(category_id: category_object.id, item_id: item.id)
  # end

  # category = Category.create(title: "House Specials", type_of: 'main_menu')

  # ItemCategory.create([{ item_id: 9, category_id: category.id},
  #                     { item_id: 10, category_id: category.id},
  #                     { item_id: 16, category_id: category.id},
  #                     { item_id: 12, category_id: category.id},
  #                     { item_id: 38, category_id: category.id}])


  def seed_items(restaurant, menu, adjectives, count)
    count.times do |i|
      begin
        puts "Seeding item number #{i} for #{restaurant.name}..."
        title = menu[rand(5)] + "_#{i}"
        desc = "#{title}. Oh so #{adjectives[rand(5)]}!"
        item = restaurant.items.create( 
          title: title,
          description: desc,
          price: rand(20) + 1,
          image: File.open("app/assets/images/seed/#{restaurant.slug.gsub(/\d+/, "")}/#{rand(5) + 1}.jpg", 'r'),
          retired: false,
          restaurant_id: restaurant.id)
      rescue
        binding.pry
        puts "Item failed to create! Trying again..."
        retry
      end
    end
  end

  restaurants = [taste_of_india, luke, nathaniel, kat, chicago_pizza, igloo_eats,
    larry_lobsters]
  asian = ["Madras Sanbar", "Naan", "Saag Paneer", "Aloo Chat", "Aloo Gobi" , "Sushi" ,""]
  taste_of_india = [ "Aloo Chat", "Idly", "Masala Chicken", "Paneer", ""
  luke = ["Crumpy Chicken", ""]
  nathaniel = 
  kat = ["Raw Pie", "Carmalized Cheese", "Tree Hugger", "Krip Salad", "Tofu Delight", "Light Faire", "Daily Special"]
  chicago_pizza = ["Pepperoni Pizza", "Deep Dish Pie", "Calzone", "Chef's Pizza", "Veggie Special"]
  igloo_eats = ["Salmon", "Crepe", "Tuna", "Big Tuna"]
  larrys_lobsters = ["Hot Lobster", "Spicy Lobster", "Sweet Lobster", "Garlic Lobster", "Steamed Whole Lobster", 
    "Steak and Lobster", "Chocolate Lobster", ]
  
  menu_lookup = { taste_of_india.slug => taste_of_india_menu, 
                  luke.slug => luke_menu,
                  nathaniel.slug => nathaniel_menu,
                  kat.slug => kat_menu,
                  chicago_pizza.slug => chicago_pizza_menu,
                  igloo_eats.slug => igloo_eats_menu,
                  larry_lobsters.slug => larry_lobsters_menu }
    
  superlatives = ["great", "delicious", "moutwatering", "classy", "appetizing"]

  Restaurant.all.each { |rest| seed_items(rest, menu_lookup[rest.slug.gsub(/\d+/, "")], superlatives, 20) }

#____________________30 different categories (3 per restaurant)_________________

  


  categoriess = ["Appetizers", "Beverages", "Entrees", "Dessert",  "Specialties", 
    "Soups", "Spicy Selections", "Vegetarian", "Salads", "Kids Menu", 
    "Snacks", "Sandwiches", "Burritos", "Pizza"]

  def seed_categories(restaurant, categories, count)
    count.times do |i|
      begin
        puts "Creating category #{i} for #{restaurant.name}..."
        category = categories[rand(10)]
        restaurant.categories.create(title: category,
                                    restaurant_id: restaurant.id)
      rescue
        binding.pry
        puts "Category already exists! Trying again..."
        retry
      end
    end
  end

  Restaurant.all.each { |rest| seed_categories(rest, cats, 5) }

  def seed_item_categories(restaurant, count)
    count.times do |i|
      begin
        puts "Seeding item category ##{i} for #{restaurant.name}..."
        item_id = restaurant.items[i - 1].id
        category_id = restaurant.categories[rand(5)].id
        ItemCategory.create!( item_id: item_id,
                              category_id: category_id)
      rescue
        binding.pry
        puts "Item category failed to create! Trying again..."
        retry
      end
    end
  end

  Restaurant.all.each do |rest| 
    @count ||= rest.items.size
    seed_item_categories(rest, @count)
  end

#_________________________100,000 users_______________________________
  
  unencrypted_password = "password"
  encrypted_password = BCrypt::Password.create(unencrypted_password)

  admin = User.create({full_name: "admin", display_name: "admin", 
    password: unencrypted_password, password_confirmation: unencrypted_password,   
    email: "admin@example.com", admin_status: true })
  
  jorge = User.create(email: "demo+jorge@jumpstartlab.com", 
    full_name: "Jorge", 
    display_name: "littlemexican", 
    password: unencrypted_password,
    password_confirmation: unencrypted_password,
    :overlord => true)

  jeff = User.create(email: "demo+jeff@jumpstartlab.com", 
    full_name: "Jeff", 
    display_name: "j3",
    password: unencrypted_password,
    password_confirmation: unencrypted_password,
    :overlord => true)

  katrina = User.create(email: "demo+katrina@jumpstartlab.com", 
    full_name: "Katrina Owen", 
    display_name: "kytrynx", 
    password: unencrypted_password,
    password_confirmation: unencrypted_password,
    :overlord => true)

  katrina = User.create(email: "katrina@engelsted.co", 
    full_name: "Katrina Engelsted", 
    display_name: "mapppingkat", 
    password: unencrypted_password,
    password_confirmation: unencrypted_password,

  luke = User.create(email: "lukemartinez@gmail.com", 
    full_name: "Luke", 
    display_name: "Lukey", 
    password: unencrypted_password,
    password_confirmation: unencrypted_password)

  nathaniel = User.create(email: "watts@nathanielwatts.com", 
    full_name: "Nathaniel", 
    display_name: "thewatts", 
    password: unencrypted_password,
    password_confirmation: unencrypted_password)

  def seed_users(count)
    count.times do |i|
      puts "Creating user #{i}"
      User.create(
        full_name: "user_number_#{i}",
        display_name: "user_#{i}",
        email: "user_#{i}@example.com",
        password: unencrypted_password,
        password_confirmation: unencrypted_password)
    end
  end

  #seed_users(100000)
  seed_users(100)

  def seed_restaurant_users(rest_id, role, count)
    unless ['customer', 'employee', 'owner'].include?(role)
      throw ArgumentError "Role must be customer, employee, owner"
  end

    count.times do |i|
      begin 
        puts "Seeding #{role} number #{i} for restaurant #{rest_id}..."
        RestaurantUser.create(
          restaurant_id: rest_id,
          user_id: User.all[rand(@size)],
          role: role)
      rescue
        puts "Failed to create role! Trying again..."
        retry
      end
    end
  end

  @size = User.all.size

  Restaurant.all.each { |r| seed_restaurant_users(r.id, "employee", 2) }
  Restaurant.all.each { |r| seed_restaurant_users(r.id, "owner", 2) }

  

#_________________________orders_______________________________
puts "Creating Orders"
Order.create([{ status: "pending"},
              { status: "pending"},
              { status: "in progress", user_id: 1},
              { status: "in progress", user_id: 2},
              { status: "paid", user_id: 3},
              { status: "paid", user_id: 1},
              { status: "completed", user_id: 2},
              { status: "completed", user_id: 3},
              { status: "cancelled", user_id: 1},
              { status: "cancelled", user_id: 2}])

puts "Creating Orders Items"
OrderItem.create([{ item_id: 1, order_id: 1, quantity: 3},
                  { item_id: 16, order_id: 1},
                  { item_id: 24, order_id: 1, quantity: 2},
                  { item_id: 30, order_id: 2, quantity: 3},
                  { item_id: 16, order_id: 2},
                  { item_id: 12, order_id: 2, quantity: 2},
                  { item_id: 1, order_id: 3},
                  { item_id: 16, order_id: 3, quantity: 2},
                  { item_id: 17, order_id: 3, quantity: 3},
                  { item_id: 1, order_id: 4, quantity: 2},
                  { item_id: 16, order_id: 4, quantity: 2},
                  { item_id: 35, order_id: 4, quantity: 3},
                  { item_id: 2, order_id: 5, quantity: 2},
                  { item_id: 16, order_id: 5},
                  { item_id: 3, order_id: 6},
                  { item_id: 16, order_id: 6, quantity: 3},
                  { item_id: 30, order_id: 6, quantity: 3},
                  { item_id: 1, order_id: 7},
                  { item_id: 7, order_id: 8},
                  { item_id: 16, order_id: 9, quantity: 2},
                  { item_id: 4, order_id: 10, quantity: 5},
                  { item_id: 16, order_id: 10, quantity: 3},
                  { item_id: 31, order_id: 10, quantity: 7}])

#_________________________images______________________________
images = File.open "./app/assets/images"


puts "Time to seed:"
puts time
