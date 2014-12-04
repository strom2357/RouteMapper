Rails.application.routes.draw do
	root to: 'static_pages#root'	


  resources :users, only: [:new, :create, :index, :show, :search] do
  	get "search", on: :collection

  	resource :followings, only: [:create, :destroy]
  end

	  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
	  resources :rides
	end
end
