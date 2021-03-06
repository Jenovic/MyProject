import * as React from 'react';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react';
import { Fade } from 'react-reveal';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Article from '../components/Article';
import Tag from '../components/Tag';
import Title from '../components/Title';
import SearchForm from '../components/SearchForm';
import CategoryManager from '../services/CategoryManager';
import Module from '../models/Module';
import ModuleManager from '../services/ModuleManager';
import Loader from '../components/Loader';
import Icon from '../components/Icon';
import CallToAction from '../components/CallToAction';

interface Props {
  history: any;
}

interface State {
  isLoaded: boolean;
  modules: Module[];
}

@observer
export default class View extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      modules: [],
    };
  }

  async componentDidMount() {
    const categories = await CategoryManager.findAll();
    console.log(categories);
    const modules = await ModuleManager.findAll();
    console.log(modules);
    this.setState({ modules, isLoaded: true });
    console.log('called 3');
  }

  render() {
    return (
      <>
        <Helmet title="Home" />
        <Hero />
        <section className="is-fullheight is-primary content">
          <div className="container archive">
            <Fade bottom>
              <div className="level">
                <Title title="Latest articles and news" size="1" color="blue" />
                <SearchForm
                  placeholder="Search articles"
                  handleSubmit={({ search }, setSubmitting) => {
                    setSubmitting(false);
                    if (search) {
                      this.props.history.push(`/modules?search=${search}`);
                    }
                  }}
                />
              </div>
            </Fade>

            {!this.state.isLoaded ? (
              <Loader />
            ) : (
              <>
                <Fade bottom>
                  <div className="meta-category is-centered">
                    <Icon iconName="tag" />
                    {CategoryManager.categories.map((category) => {
                      const categoryUrl = `/modules?category=${category.uuid}`;
                      return <Tag tagName={category.name} link={categoryUrl} />;
                    })}
                  </div>
                </Fade>
                <Fade bottom>
                  <div className="cols is-centered is-multiline articles">
                    {this.state.modules.slice(0, 4).map((module) => {
                      return (
                        <Article
                          key={module.uuid}
                          title={module.title}
                          author={module.createdBy}
                          date={module.createdAt.fromNow()}
                          module={module}
                        />
                      );
                    })}
                    <div className="col is-12">
                      <div className="view-all-button">
                        <a href="/articles" className="button is-dark">
                          <span>View All</span>
                          <Icon iconName="arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Fade>
              </>
            )}
          </div>
        </section>
        <CallToAction />
        <Footer />
      </>
    );
  }
}
