import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Camera, Grid3X3, Film, Bookmark, Plus, Video, Image, Zap, Heart, Play, Upload, Clock } from 'lucide-react'

export function InstagramContentGrid({ 
  userProfile, 
  isOwnProfile = false,
  profileTab = 'posts',
  onTabChange = () => {},
  onFileUpload = () => {},
  onStartLiveStream = () => {}
}) {
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const posts = userProfile?.posts || []
  const reels = userProfile?.reels || []

  const handleUploadClick = (type) => {
    setShowUploadMenu(false)
    onFileUpload(type)
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200">
        <div className="flex justify-center">
          <div className="flex space-x-8">
            <button 
              onClick={() => onTabChange('posts')}
              className={`flex items-center space-x-1 py-3 border-b-2 ${
                profileTab === 'posts' ? 'border-black' : 'border-transparent'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">Publicações</span>
            </button>
            
            <button 
              onClick={() => onTabChange('reels')}
              className={`flex items-center space-x-1 py-3 border-b-2 ${
                profileTab === 'reels' ? 'border-black' : 'border-transparent'
              }`}
            >
              <Film className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wide">Reels</span>
            </button>
            
            {isOwnProfile && (
              <button 
                onClick={() => onTabChange('saved')}
                className={`flex items-center space-x-1 py-3 border-b-2 ${
                  profileTab === 'saved' ? 'border-black' : 'border-transparent'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wide">Salvos</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-0">
        {profileTab === 'posts' && (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post, index) => (
                  <div key={post.id || index} className="aspect-square relative group cursor-pointer">
                    <img 
                      src={post.url} 
                      alt={post.caption || `Post ${index + 1}`} 
                      className="w-full h-full object-cover bg-gray-200"
                      style={{ minHeight: '100px' }}
                      onLoad={(e) => {
                        e.target.style.opacity = '1'
                        e.target.style.backgroundColor = 'transparent'
                      }}
                      onError={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6'
                        e.target.alt = 'Imagem não disponível'
                        console.log('Post image error:', post.url)
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 text-white flex space-x-4 transition-opacity">
                        <div className="flex items-center">
                          <Heart className="w-5 h-5 mr-1" />
                          <span>{post.likes || Math.floor(Math.random() * 100) + 10}</span>
                        </div>
                        {post.type === 'video' && (
                          <div className="flex items-center">
                            <Play className="w-5 h-5 mr-1" />
                            <span>{post.views || Math.floor(Math.random() * 1000) + 100}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {post.type === 'video' && (
                      <div className="absolute top-2 right-2">
                        <Video className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                ))}
                {isOwnProfile && (
                  <div className="aspect-square relative">
                    <button
                      onClick={() => setShowUploadMenu(true)}
                      className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 rounded-none flex items-center justify-center cursor-pointer group"
                    >
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-gray-500 mx-auto mb-2 group-hover:text-purple-600 transition-colors" />
                        <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">Nova publicação</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">Nenhuma publicação ainda</h3>
                <p className="text-gray-400 mb-4">
                  {isOwnProfile 
                    ? "Compartilhe sua primeira foto ou vídeo" 
                    : `Quando ${userProfile?.name?.split(' ')[0]} compartilhar, aparecerá aqui.`
                  }
                </p>
                {isOwnProfile && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowUploadMenu(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg inline-flex items-center shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Criar Conteúdo
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {profileTab === 'reels' && (
          <>
            {reels.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {reels.map((reel, index) => (
                  <div key={reel.id || index} className="aspect-[3/4] relative group cursor-pointer">
                    <img 
                      src={reel.thumbnail} 
                      alt={`Reel ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <Play className="opacity-0 group-hover:opacity-100 w-8 h-8 text-white transition-opacity" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-sm flex items-center">
                      <Play className="w-3 h-3 mr-1" />
                      {reel.views || Math.floor(Math.random() * 10000) + 1000}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Film className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  </div>
                ))}
                {isOwnProfile && (
                  <div className="aspect-[3/4] relative">
                    <button
                      onClick={() => handleUploadClick('reel')}
                      className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 rounded-none flex items-center justify-center cursor-pointer group"
                    >
                      <div className="text-center">
                        <Film className="w-8 h-8 text-gray-500 mx-auto mb-2 group-hover:text-purple-600 transition-colors" />
                        <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">Novo reel</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-400 mb-2">Nenhum reel ainda</h3>
                <p className="text-gray-400 mb-4">
                  {isOwnProfile 
                    ? "Crie seu primeiro reel" 
                    : `${userProfile?.name?.split(' ')[0]} ainda não criou reels.`
                  }
                </p>
                {isOwnProfile && (
                  <button
                    onClick={() => handleUploadClick('reel')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg inline-flex items-center shadow-lg"
                  >
                    <Film className="w-5 h-5 mr-2" />
                    Criar Reel
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {profileTab === 'saved' && isOwnProfile && (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">Nenhuma publicação salva</h3>
            <p className="text-gray-400">Salve publicações para vê-las aqui</p>
          </div>
        )}
      </div>

      {/* Dialog de Menu de Upload */}
      <Dialog open={showUploadMenu} onOpenChange={setShowUploadMenu}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-800">
              <Plus className="w-5 h-5" />
              Criar Conteúdo
            </DialogTitle>
            <DialogDescription>
              Escolha o tipo de conteúdo que você quer criar e compartilhar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Publicação de Foto */}
            <button
              onClick={() => handleUploadClick('post')}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Publicação</h3>
                <p className="text-sm text-gray-500">Compartilhe fotos no seu feed</p>
              </div>
            </button>

            {/* Story */}
            <button
              onClick={() => handleUploadClick('story')}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Story</h3>
                <p className="text-sm text-gray-500">Compartilhe momentos temporários</p>
              </div>
            </button>

            {/* Reel */}
            <button
              onClick={() => handleUploadClick('reel')}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Reel</h3>
                <p className="text-sm text-gray-500">Crie vídeos curtos e criativos</p>
              </div>
            </button>

            {/* Vídeo */}
            <button
              onClick={() => handleUploadClick('video')}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Vídeo</h3>
                <p className="text-sm text-gray-500">Compartilhe vídeos longos</p>
              </div>
            </button>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={() => {
                setShowUploadMenu(false)
                onStartLiveStream()
              }}
              className="w-full group p-4 border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all"
            >
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Transmissão ao Vivo</h3>
                  <p className="text-sm text-gray-500">Conecte-se em tempo real</p>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}