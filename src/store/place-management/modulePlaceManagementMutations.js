export default {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_CATEGORIES(state, category) {
    state.categories.push(Object.assign({}, category))
  },
  UPDATE_CATEGORY(state, category) {
    if(state.categories.length){
      const roleIndex = state.categories.findIndex((t) => t.id == category.id)
      Object.assign(state.categories[roleIndex], category)
    }
    else state.categories = [category]
  },
  DELETE_CATEGORY(state, categoryId) {
    const index = state.categories.findIndex(i => i.id == categoryId)
    if (index > -1) { state.categories.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_GROUPS(state, groups) {
    state.groups = groups
  },
  ADD_GROUPS(state, group) {
    state.groups.push(Object.assign({}, group))
  },
  UPDATE_GROUP(state, group) {
    if(state.groups.length){
      const roleIndex = state.groups.findIndex((t) => t.id == group.id)
      Object.assign(state.groups[roleIndex], group)
    }
    else state.groups = [group]
  },
  DELETE_GROUP(state, groupId) {
    const index = state.groups.findIndex(i => i.id == groupId)
    if (index > -1) { state.groups.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts
  },
  ADD_CONTACTS(state, contact) {
    state.contacts.push(Object.assign({}, contact))
  },
  UPDATE_CONTACTS(state, contact) {
    if(state.contacts.length){
      const roleIndex = state.contacts.findIndex((t) => t.id == contact.id)
      Object.assign(state.contacts[roleIndex], contact)
    }
    else state.contacts = [contact]
  },
  DELETE_CONTACT(state, contactId) {
    const index = state.contacts.findIndex(i => i.id == contactId)
    if (index > -1) { state.contacts.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_APP(state, apps) {
    state.apps = apps
  },
  ADD_APP(state, app) {
    state.apps.push(Object.assign({}, app))
  },
  UPDATE_APP(state, app) {
    if(state.apps.length){
      const roleIndex = state.apps.findIndex((t) => t.id == app.id)
      Object.assign(state.apps[roleIndex], app)
    }
    else state.apps = [app]
  },
  DELETE_APP(state, appId) {
    const index = state.apps.findIndex(i => i.id == appId)
    if (index > -1) { state.apps.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_TRANSLATION(state, translations) {
    state.translations = translations
  },
  ADD_TRANSLATION(state, translation) {
    state.translations.push(Object.assign({}, translation))
  },
  UPDATE_TRANSLATION(state, translation) {
    if(state.translations.length){
      const roleIndex = state.translations.findIndex((t) => t.id == translation.id)
      Object.assign(state.translations[roleIndex], translation)
    }
    else state.translations = [translation]
  },
  DELETE_TRANSLATION(state, translationId) {
    const index = state.translations.findIndex(i => i.id == translationId)
    if (index > -1) { state.translations.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_TERM(state, terms) {
    state.terms = terms
  },
  ADD_TERM(state, term) {
    // [term].concat(state.terms)
    state.terms.unshift(term);
    // state.terms.push(Object.assign({}, term))
  },
  UPDATE_TERM(state, term) {
    if(state.terms.length){
      const roleIndex = state.terms.findIndex((t) => t.id == term.id)
      Object.assign(state.terms[roleIndex], term)
    }
    else state.terms = [term]
  },
  DELETE_TERM(state, termId) {
    const index = state.terms.findIndex(i => i.id == termId)
    if (index > -1) { state.terms.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_LANGUAGE(state, languages) {
    state.languages = languages
  },
  ADD_LANGUAGE(state, language) {
    // [language].concat(state.languages)
    // state.languages.unshift(language);
    state.languages.push(Object.assign({}, language))
  },
  UPDATE_LANGUAGE(state, language) {
    if(state.languages.length){
      const roleIndex = state.languages.findIndex((t) => t.id == language.id)
      Object.assign(state.languages[roleIndex], language)
    }
    else state.languages = [language]
  },
  DELETE_LANGUAGE(state, languageId) {
    const index = state.languages.findIndex(i => i.id == languageId)
    if (index > -1) { state.languages.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_PLACE(state, places) {
    state.places = places
  },
  ADD_PLACE(state, place) {
    // [place].concat(state.places)
    // state.places.unshift(place);
    state.places.push(Object.assign({}, place))
  },
  UPDATE_PLACE(state, place) {
    if(state.places.length){
      const roleIndex = state.places.findIndex((t) => t.id == place.id)
      if(roleIndex > -1) Object.assign(state.places[roleIndex], place)
    }
    else state.places = [place]
  },
  DELETE_PLACE(state, placeId) {
    const index = state.places.findIndex(i => i.id == placeId)
    if (index > -1) { state.places.splice(index, 1) }
  },
  //////////////////////////////////////////
  SET_FILTER(state, filters) {
    state.filters = filters
  },
  ADD_FILTER(state, filter) {
    // [filter].concat(state.filters)
    // state.filters.unshift(filter);
    state.filters.push(Object.assign({}, filter))
  },
  UPDATE_FILTER(state, filter) {
    if(state.filters.length){
      const roleIndex = state.filters.findIndex((t) => t.id == filter.id)
      Object.assign(state.filters[roleIndex], filter)
    }
    else state.filters = [filter]
  },
  DELETE_FILTER(state, filterId) {
    const index = state.filters.findIndex(i => i.id == filterId)
    if (index > -1) { state.filters.splice(index, 1) }
  },
}
