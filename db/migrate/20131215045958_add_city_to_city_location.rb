class AddCitytoCities < ActiveRecord::Migration
  def change
    create_table :city_location do |t|
      t.string :city

      t.timestamps
  end
end
