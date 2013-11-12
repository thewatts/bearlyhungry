class Category < ActiveRecord::Base
  has_many :item_categories
  has_many :items, through: :item_categories

  def slug
    title.downcase.gsub(' ', '-')
  end

  def self.find_by_slug(slug)
    title = slug.gsub('-', ' ').titleize
    find_by(title: title)
  end
end
