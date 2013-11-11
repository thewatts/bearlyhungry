require 'bcrypt'

unencrypted_password = "password"
encrypted_password = BCrypt::Password.create(unencrypted_password)

user = User.create([{full_name: "Franklin Webber", display_name: "Franky", password: unencrypted_password, password_confirmation: unencrypted_password,   email: "demo+franklin@jumpstartlab.com" },
                    {full_name: "Jeff", display_name: "j3", password: unencrypted_password, password_confirmation: unencrypted_password, email: "demo+jeff@jumpstartlab.com"},
                    {full_name: "Katrina Owen", display_name: "kytrinyx", password: unencrypted_password, password_confirmation: unencrypted_password, email: "demo+katrina@jumpstartlab.com", admin_status: true }])

admin = User.create({full_name: "admin", display_name: "admin", password: unencrypted_password, password_confirmation: unencrypted_password,   email: "admin@example.com", admin_status: true })

require 'csv'

images = File.open "./app/assets/images"

contents = CSV.open "./db/db_seed.csv", headers: true, header_converters: :symbol

contents.each do |row|

  title       = row[:title]
  description = row[:description]
  price       = row[:price]
  category    = row[:category]
  image_file_name = row[:image_file_name]

  category_object = Category.find_or_create_by(title: category, type_of: 'main_menu')
  item = Item.create(title: title, description: description, price: price, image_file_name: image_file_name)

  ItemCategory.create(category_id: category_object.id, item_id: item.id)
end



