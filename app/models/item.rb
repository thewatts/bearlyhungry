class Item < ActiveRecord::Base
  validates :title, :description, :price, presence: true
  validates :title, uniqueness: true
  validates :price, numericality: { greater_than: 0 }
  has_attached_file :image

  has_many :order_items
  has_many :orders, through: :order_items
  has_many :item_categories
  has_many :categories, :through => :item_categories


  def self.available_items
    where(:available => true)
  end
end
