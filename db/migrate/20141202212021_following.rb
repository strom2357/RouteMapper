class Following < ActiveRecord::Migration
   def change
    create_table :followings do |t|
      t.integer :user_id, null: false
      t.integer :followed_user_id, null: false

      t.timestamps
    end

    add_index :followings, [:user_id, :followed_user_id]
  end
end
