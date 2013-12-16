# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131216051206) do

  create_table "categories", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.string   "type_of"
  end

  create_table "cities", force: true do |t|
    t.string   "city"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "item_categories", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "item_id"
    t.integer  "category_id"
  end

  add_index "item_categories", ["category_id"], name: "index_item_categories_on_category_id"
  add_index "item_categories", ["item_id"], name: "index_item_categories_on_item_id"

  create_table "items", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.decimal  "price",              precision: 15, scale: 2
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.boolean  "available",                                   default: true
    t.integer  "restaurant_id"
  end

  add_index "items", ["restaurant_id"], name: "index_items_on_restaurant_id"

  create_table "jobs", force: true do |t|
    t.integer  "user_id",       null: false
    t.integer  "restaurant_id", null: false
    t.integer  "role_id",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "order_items", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "item_id"
    t.integer  "order_id"
    t.integer  "quantity",   default: 1
    t.decimal  "price"
  end

  add_index "order_items", ["item_id"], name: "index_order_items_on_item_id"
  add_index "order_items", ["order_id"], name: "index_order_items_on_order_id"

  create_table "orders", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status",        default: "pending"
    t.integer  "user_id"
    t.integer  "restaurant_id"
  end

  add_index "orders", ["restaurant_id"], name: "index_orders_on_restaurant_id"
  add_index "orders", ["user_id"], name: "index_orders_on_user_id"

  create_table "restaurants", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "slug"
    t.string   "status",     default: "pending"
    t.integer  "city_id"
  end

  add_index "restaurants", ["slug"], name: "index_restaurants_on_slug"

  create_table "roles", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "full_name"
    t.string   "display_name"
    t.string   "email"
    t.string   "password_digest"
    t.boolean  "admin_status",    default: false
    t.boolean  "guest",           default: false
    t.decimal  "phone_number"
    t.boolean  "deleted"
  end

end
