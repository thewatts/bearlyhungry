require 'bcrypt'

unencrypted_password = "password"
encrypted_password = BCrypt::Password.create(unencrypted_password)

user = User.create([{full_name: "Franklin Webber", display_name: "Franky", password_digest: encrypted_password,  email: "demo+franklin@jumpstartlab.com" },
                    {full_name: "Jeff", display_name: "j3", password_digest: encrypted_password, email: "demo+jeff@jumpstartlab.com"},
                    {full_name: "Katrina Owen", display_name: "kytrinyx", password_digest: encrypted_password   , email: "demo+katrina@jumpstartlab.com"}])

require 'csv'

images = File.open "./app/assets/images"

contents = CSV.open "./db/db_seed.csv", headers: true, header_converters: :symbol

contents.each do |row|

  title       = row[:title]
  description = row[:description]
  price       = row[:price]
  category    = row[:category]

  category_object = Category.find_or_create_by(title: category, type_of: 'main_menu')
  item = Item.create(title: title, description: description, price: price)

  ItemCategory.create(category_id: category_object.id, item_id: item.id)
end



