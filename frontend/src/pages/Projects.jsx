import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Star, GitFork, Code2 } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'

const GH_USER = 'Pranav1295-P'

const languageColors = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
}

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load repositories')
        return r.json()
      })
      .then((data) => {
        // Sort: pinned-feeling first (stars then updated)
        const sorted = data
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
        setRepos(sorted)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="section-eyebrow">— 02 / Projects —</span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-tight">
              <span className="text-white/90">From the </span>
              <span className="italic text-gradient-gold">Workshop</span>
            </h1>
            <p className="mt-6 max-w-2xl text-white/60">
              Live feed of repositories from{' '}
              <a
                href={`https://github.com/${GH_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:underline"
              >
                @{GH_USER}
              </a>
              .
            </p>
          </motion.div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse h-48">
                  <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
                  <div className="h-3 w-full bg-white/5 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="glass rounded-2xl p-8 text-center text-white/60">
              Couldn't load repositories. Visit{' '}
              <a href={`https://github.com/${GH_USER}`} className="text-gold-400 underline">
                GitHub directly
              </a>
              .
            </div>
          )}

          {!loading && !error && repos.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-white/60">
              No public repositories yet.
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.6), duration: 0.5 }}
                className="glass glass-hover rounded-2xl p-6 flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg border border-gold-500/20 flex items-center justify-center bg-ink-900">
                    <Code2 size={16} className="text-gold-400" />
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-white/30 group-hover:text-gold-400 transition-colors"
                  />
                </div>

                <h3 className="font-display text-lg text-white mb-2 truncate">
                  {repo.name}
                </h3>

                <p className="text-xs text-white/55 line-clamp-3 mb-4 leading-relaxed min-h-[3rem]">
                  {repo.description || 'No description provided.'}
                </p>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-white/50">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: languageColors[repo.language] || '#888' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={11} /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={11} /> {repo.forks_count}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <a
              href={`https://github.com/${GH_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <Github size={16} />
              View all on GitHub
            </a>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
